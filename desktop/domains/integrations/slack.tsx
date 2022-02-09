import { gql } from "@apollo/client";
import { autorun } from "mobx";
import React from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { getNullableDb } from "@aca/desktop/clientdb";
import { authStore } from "@aca/desktop/store/authStore";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";

import { IntegrationIcon } from "./IntegrationIcon";
import { SlackSettings } from "./SlackSettings";
import { IntegrationClient } from "./types";

const getIsConnected = () => {
  const user = getAuthUser();
  return Boolean(user && user.has_slack_installation);
};

export const slackIntegrationClient: IntegrationClient = {
  kind: "integration",
  name: "Slack",
  description: "Important or urgent conversations.",
  icon: <IntegrationIcon imageUrl={integrationLogos.slack} />,

  additionalSettings: <SlackSettings />,
  getIsConnected: () => {
    return getIsConnected();
  },
  getCanConnect() {
    return !!getAuthUser();
  },
  async connect() {
    if (getIsConnected()) return;

    const url = await querySlackInstallationURL();

    const closeSlackInstallWindow = await connectSlackBridge({ url });

    return new Promise<void>((resolve) => {
      const stop = autorun(() => {
        if (getIsConnected()) {
          closeSlackInstallWindow?.();
          stop();
          resolve();
        }
      });
    });
  },
};

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
