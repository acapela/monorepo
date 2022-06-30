import React from "react";

import { defineAction } from "@aca/desktop/actions/action";
import { trackEvent } from "@aca/desktop/analytics";
import { IntegrationIcon } from "@aca/desktop/domains/integrations/IntegrationIcon";
import { desktopRouter } from "@aca/desktop/routes";
import { areArraysShallowEqual } from "@aca/shared/array";
import { isNotFalsy } from "@aca/shared/nullish";
import { mapArrayToObject } from "@aca/shared/object";
import { IconArrowLeft, IconEdit } from "@aca/ui/icons";
import { Avatar } from "@aca/ui/users/Avatar";
import { cachedComputed } from "@acapela/clientdb";

import { getNullableDb } from "../clientdb";
import { gmailAccountEntity } from "../clientdb/notification/gmail/account";
import { slackTeamEntity } from "../clientdb/slackTeam";
import { slackIntegrationClient } from "../domains/integrations/slack";
import { getSlackConversations, getSlackUsers } from "../domains/slack/conversations";
import { ActionContext } from "./action/context";
import { defineGroup } from "./action/group";

export const exitComposeMode = defineAction({
  name: "Exit compose",
  icon: <IconArrowLeft />,
  keywords: ["exit", "back"],
  shortcut: "Esc",
  canApply: () => desktopRouter.getIsRouteActive("compose"),
  handler() {
    desktopRouter.goBack();
  },
});

const getIsEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const getGmailComposeTargetActions = cachedComputed((context: ActionContext) => {
  const accounts = getNullableDb()?.entity(gmailAccountEntity).all ?? [];

  const accountsGroups = accounts.map((account) => {
    return defineGroup({ id: `compose-group-${account.id}`, name: `Gmail - ${account.account?.email}` });
  });

  const isEmailKeyword = getIsEmail(context.searchKeyword);

  const actions = accountsGroups.flatMap((accountGroup) => {
    return [
      defineAction({
        name: "New email",
        id: `compose-new-${accountGroup.id}`,
        group: accountGroup,
        handler() {
          desktopRouter.navigate("compose", { url: `https://mail.google.com/mail/u/0/?fs=1&to=&su=&body=&tf=cm` });

          trackEvent("New Message Composed", { integration: "Gmail" });

          //
        },
      }),
      isEmailKeyword &&
        defineAction({
          name: `Send email to ${context.searchKeyword}`,
          id: `compose-new-${context.searchKeyword}`,
          group: accountGroup,
          handler() {
            const url = `https://mail.google.com/mail/u/0/?fs=1&to=${context.searchKeyword}&tf=cm`;
            desktopRouter.navigate("compose", { url: url });

            trackEvent("New Message Composed", { integration: "Gmail" });
          },
        }),
    ].filter(isNotFalsy);
  });

  return actions;
});

const getSlackComposeTargetActions = cachedComputed(
  () => {
    const slackTeamLookup = mapArrayToObject(getNullableDb()?.entity(slackTeamEntity).all ?? [], (team) => {
      return {
        key: team.slack_team_id,
        value: defineGroup({ id: `compose-group-${team.id}`, name: `Slack Team - ${team.team_info_data?.name}` }),
      };
    });

    const slackUsers = getSlackUsers()
      .filter((user) => !user.is_bot)
      .map((slackUser) => {
        return defineAction({
          id: `compose-${slackUser.id}`,
          name: slackUser.real_name ?? slackUser.display_name,
          group: slackTeamLookup[slackUser.workspace_id],
          supplementaryLabel: `@${slackUser.display_name}`,
          get icon() {
            if (slackUser.avatar_url) {
              return <Avatar src={slackUser.avatar_url} />;
            }

            return <IntegrationIcon integrationClient={slackIntegrationClient} />;
          },
          handler() {
            const url = `https://app.slack.com/client/${slackUser.workspace_id}/${slackUser.conversation_id}`;

            trackEvent("New Message Composed", { integration: "Slack" });

            desktopRouter.navigate("compose", { url });
          },
        });
      });

    const slackChannels = getSlackConversations().map((conversation) => {
      return defineAction({
        id: `compose-${conversation.id}`,
        name: `#${conversation.name}`,
        supplementaryLabel: "Channel",
        group: slackTeamLookup[conversation.workspace_id],
        icon: <IntegrationIcon integrationClient={slackIntegrationClient} />,
        handler() {
          const url = `https://app.slack.com/client/${conversation.workspace_id}/${conversation.id}`;

          trackEvent("New Message Composed", { integration: "Slack" });

          desktopRouter.navigate("compose", { url });
        },
      });
    });

    return [...slackUsers, ...slackChannels];
  },
  { equals: areArraysShallowEqual }
);

export const openCompose = defineAction({
  name: "Compose",
  shortcut: ["Meta", "N"],

  icon: <IconEdit />,
  handler() {
    return {
      searchPlaceholder: "Write to...",
      hideTarget: true,
      getActions(ctx) {
        return [...getGmailComposeTargetActions(ctx), ...getSlackComposeTargetActions()];
      },
    };
  },
});
