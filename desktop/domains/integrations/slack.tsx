import { gql } from "@apollo/client";
import { autorun, computed } from "mobx";
import React from "react";

import { trackEvent } from "@aca/desktop/analytics";
import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { connectSlackBridge } from "@aca/desktop/bridge/auth";
import { accountStore } from "@aca/desktop/store/account";
import { GetIndividualSlackInstallationUrlQuery, GetIndividualSlackInstallationUrlQueryVariables } from "@aca/gql";
import { assertDefined } from "@aca/shared/assert";

import { IntegrationIcon } from "./IntegrationIcon";
import { SlackSettings } from "./SlackSettings";
import { IntegrationClient } from "./types";

const SLACK_URL_SCHEME = "slack://";

export const slackIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_slack_message",
  name: "Slack",
  description: "Important or urgent conversations.",
  icon: <IntegrationIcon imageUrl={integrationLogos.slack} />,

  additionalSettings: <SlackSettings />,
  get isReady() {
    return computed(() => accountStore.user !== null);
  },
  getCanConnect: () => !!accountStore.user,
  getAccounts: () =>
    accountStore.user?.slackInstallations.all.map((i) => ({ kind: "account", id: i.team_id!, name: i.team_name! })) ??
    [],
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
  async connect(teamId) {
    const url = await querySlackInstallationURL(teamId);

    const getInstallationsCount = () => accountStore.user?.slackInstallations.count ?? 0;
    const initialInstallationsCount = getInstallationsCount();

    const closeSlackInstallWindow = await connectSlackBridge({ url });

    return new Promise<void>((resolve) => {
      const stop = autorun(() => {
        if (initialInstallationsCount < getInstallationsCount()) {
          if (closeSlackInstallWindow) {
            closeSlackInstallWindow();
            trackEvent("Slack Integration Added");
          }
          stop();
          resolve();
        }
      });
    });
  },
  async disconnect(teamId) {
    accountStore.user?.slackInstallations.query({ team_id: teamId }).first?.remove();
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
    }
  );
  return assertDefined(slackInstallation?.url, "missing slack installation url");
}
