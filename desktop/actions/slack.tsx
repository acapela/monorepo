import { gql } from "@apollo/client";
import { autorun } from "mobx";
import React from "react";

import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";
import { IconPlus, IconToggleOff, IconToggleOn } from "@aca/ui/icons";

import { apolloClient } from "../apolloClient";
import { connectSlackBridge } from "../bridge/auth";
import { getNullableDb } from "../clientdb";
import { authStore } from "../store/authStore";
import { defineAction } from "./action";
import { accountActionsGroup, getContextualServiceName } from "./auth";

const getAuthUser = () => getNullableDb()?.user.findById(authStore.user.id) ?? null;

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

// We want to close any Slack install windows, as soon as the user has a Slack installation
let closeSlackInstallWindow: Function | void = void null;
autorun(() => {
  const user = getAuthUser();
  if (user?.has_slack_installation) {
    closeSlackInstallWindow?.();
  }
});
export const connectSlack = defineAction({
  name: getContextualServiceName("Slack"),
  icon: <IconPlus />,
  group: accountActionsGroup,
  canApply: () => {
    const user = getAuthUser();
    return Boolean(user && !user.has_slack_installation);
  },
  handler() {
    querySlackInstallationURL().then((url) => {
      closeSlackInstallWindow = connectSlackBridge({ url });
    });
  },
});

const getIsAutoResolveEnabled = () => Boolean(getAuthUser()?.is_slack_auto_resolve_enabled);

export const toggleSlackAutoResolve = defineAction({
  name: () => (getIsAutoResolveEnabled() ? "Disable Slack Auto Resolve" : "Enable Slack Auto Resolve"),
  group: accountActionsGroup,
  icon: () => (getIsAutoResolveEnabled() ? <IconToggleOn /> : <IconToggleOff />),
  canApply: () => Boolean(getAuthUser()?.has_slack_installation),
  handler() {
    const user = assertDefined(getAuthUser(), "missing user");
    user.update({ is_slack_auto_resolve_enabled: !user.is_slack_auto_resolve_enabled });
  },
});
