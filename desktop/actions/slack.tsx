import { gql } from "@apollo/client";
import { autorun } from "mobx";
import React from "react";

import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";
import { IconAtom, IconToggleOn } from "@aca/ui/icons";

import { apolloClient } from "../apolloClient";
import { connectSlackBridge } from "../bridge/auth";
import { getDb } from "../clientdb";
import { authStore } from "../store/authStore";
import { defineAction } from "./action";
import { accountActionsGroup } from "./auth";

function getAuthUser() {
  const user = getDb().user.findById(authStore.user.id);
  return user;
}

async function querySlackInstallationURL() {
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
      variables: { input: { redirectURL: "" } },
    }
  );
  return assertDefined(slackInstallation?.url, "missing slack installation url");
}

export const connectSlack = defineAction({
  name: "Connect Slack",
  icon: <IconAtom />,
  group: accountActionsGroup,
  canApply: () => {
    const user = getAuthUser();
    return Boolean(user && !user.has_slack_installation);
  },
  async handler() {
    const closeSlackWindow = connectSlackBridge({ url: await querySlackInstallationURL() });
    const user = getAuthUser();

    const disposer = autorun(() => {
      if (user?.has_slack_installation) {
        closeSlackWindow?.();
        disposer();
      }
    });
  },
});

const getIsAutoResolveEnabled = () => Boolean(getAuthUser()?.is_slack_auto_resolve_enabled);

export const toggleSlackAutoResolve = defineAction({
  name: () => (getIsAutoResolveEnabled() ? "Disable Slack Auto Resolve" : "Enable Slack Auto Resolve"),
  group: accountActionsGroup,
  icon: <IconToggleOn />,
  canApply: () => !!getAuthUser(),
  handler() {
    const user = assertDefined(getAuthUser(), "missing user");
    user.update({ is_slack_auto_resolve_enabled: !user.is_slack_auto_resolve_enabled });
  },
});
