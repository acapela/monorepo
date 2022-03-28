import { gql } from "@apollo/client";
import React from "react";

import { GitHubInstallation } from "@aca/db";
import { defineAction } from "@aca/desktop/actions/action";
import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { SettingRow } from "@aca/desktop/ui/settings/SettingRow";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

const connectNewOrganization = defineAction({
  name: "Connect",
  async handler() {
    await queryGitHubInstallations();
    await loginGitHubBridge();
  },
});

export const githubIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_github",
  name: "GitHub",
  description: "New issues, comments and mentions.",
  isReady: githubAuthTokenBridgeValue.observables.isReady,
  additionalSettings: (
    <SettingRow title="Link another organization" description="TODO">
      <ActionButton action={connectNewOrganization} kind="primary" iconAtStart={false} />
    </SettingRow>
  ),
  getCanConnect: () => !githubAuthTokenBridgeValue.get(),
  getAccounts: () => (githubAuthTokenBridgeValue.get() ? [{ kind: "account", id: "github", name: "GitHub" }] : []),
  async connect() {
    await loginGitHubBridge();
  },
  async disconnect() {
    await loginGitHubBridge({ logout: true });
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.github} />,
};

// TODO: display in settings page
async function queryGitHubInstallations(): Promise<GitHubInstallation[]> {
  const {
    data: { github_installations },
  } = await apolloClient.query<{ github_installations: GitHubInstallation[] }, null>({
    query: gql`
      query GetGitHubInstallations {
        github_installations {
          id
          isOrg
          name
        }
      }
    `,
  });
  return github_installations;
}
