import { gql } from "@apollo/client";
import { autorun } from "mobx";
import React from "react";

import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";

import { IntegrationIcon } from "./IntegrationIcon";
import { SlackSettings } from "./SlackSettings";
import { IntegrationClient } from "./types";

const getIsConnected = () => {
  const user = accountStore.user;
  return Boolean(user && user.has_slack_installation);
};

const SLACK_URL_SCHEME = "slack://";

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
    return !!accountStore.user;
  },
  convertToLocalAppUrl: async (notification) => {
    const inner = notification.inner;
    if (inner?.__typename !== "notification_slack_message") {
      console.error("Something went wrong getting inner slack notification");
      return {
        fallback: notification.url,
      };
    }

    if (!inner.slackTeamId) {
      console.error("No slack team id");
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