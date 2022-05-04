import { gql } from "@apollo/client";
import { autorun } from "mobx";
import React from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { getNullableDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";

import { makeLogger } from "../dev/makeLogger";
import { SlackSettings } from "./SlackSettings";
import { IntegrationClient } from "./types";

const SLACK_URL_SCHEME = "slack://";

const log = makeLogger("SlackIntegrationClient");

function getAccounts() {
  const slackTeamsById = new Map((getNullableDb()?.slackTeam.all ?? []).map((team) => [team.slack_team_id, team]));
  return (
    accountStore.user?.slackInstallations.all.map(
      (i) =>
        ({
          kind: "account",
          id: i.team_id!,
          name: i.team_name!,
          imageURL: slackTeamsById.get(i.team_id!)?.team_info_data.icon?.image_34,
        } as const)
    ) ?? []
  );
}

export const slackIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_slack_message",
  name: "Slack",
  description: "Important or urgent conversations.",
  additionalSettings: <SlackSettings />,
  imageURL: integrationLogos.slack,
  getCanConnect: () => !!accountStore.user,
  getIsConnected: () => {
    return accountStore.user?.slackInstallations.hasItems ?? false;
  },
  getAccounts,
  getComposeURLs: () =>
    getAccounts().map((team) => ({
      accountId: team.id,
      url: `https://app.slack.com/client/${team.id}/composer/draft`,
    })),
  convertToLocalAppUrl: async (notification) => {
    const inner = notification.inner;
    if (inner?.__typename !== "notification_slack_message") {
      log.error("Something went wrong getting inner slack notification. Instead got: ", JSON.stringify(inner, null, 2));
      return {
        fallback: notification.url,
      };
    }

    if (!inner.slackTeamId) {
      log.warn("No slack team id");
      return {
        fallback: notification.url,
      };
    }

    const messageQueryIfApplicable = inner.slack_message_ts ? `&message=${inner.slack_message_ts}` : "";
    const threadQueryIfApplicable = inner.slack_thread_ts ? `&thread_ts=${inner.slack_thread_ts}` : "";

    return {
      protocol: "slack",
      localUrl: `${SLACK_URL_SCHEME}channel?team=${inner.slackTeamId}&id=${inner.slack_conversation_id}${messageQueryIfApplicable}${threadQueryIfApplicable}`,
      fallback: notification.url,
    };
  },
  async connect(teamId) {
    const url = await querySlackInstallationURL(teamId);

    const getFullInstallationsCount = () =>
      accountStore.user?.slackInstallations.query({ hasAllScopes: true }).count ?? 0;
    const initialInstallationsCount = getFullInstallationsCount();

    const closeSlackInstallWindow = await connectSlackBridge({ url });

    return new Promise<void>((resolve) => {
      const stop = autorun(() => {
        if (initialInstallationsCount < getFullInstallationsCount()) {
          if (closeSlackInstallWindow) {
            closeSlackInstallWindow();
          }
          stop();
          resolve();
        }
      });
    });
  },
  async disconnect(teamId) {
    const installation = accountStore.user?.slackInstallations.query({ team_id: teamId }).first;
    installation?.channelFilters.all.forEach((channelFilter) => channelFilter.remove());
    installation?.remove();
  },
};

async function querySlackInstallationURL(teamId?: string) {
  const {
    data: { slackInstallation },
  } = await apolloClient.query<GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables>(
    {
      query: gql`
        query GetIndividualSlackInstallationURL($input: GetSlackInstallationURLInput!) {
          slackInstallation: get_slack_installation_url(input: $input) {
            url
          }
        }
      `,
      variables: { input: { teamId, redirectURL: "" } },
      fetchPolicy: "no-cache",
    }
  );
  return assertDefined(slackInstallation?.url, "missing slack installation url");
}
