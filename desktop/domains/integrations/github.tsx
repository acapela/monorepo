import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { githubAuthTokenBridgeValue, loginGitHubBridge } from "@aca/desktop/bridge/auth";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const githubIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_github",
  name: "GitHub",
  description: "New issues, comments and mentions.",
  isReady: githubAuthTokenBridgeValue.observables.isReady,
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
