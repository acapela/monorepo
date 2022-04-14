import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const gmailIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_gmail",
  name: "GMail",
  description: "New emails",
  getCanConnect: () => !getDb().gmailAccount.hasItems,
  getAccounts: () =>
    getDb().gmailAccount.all.map((gmailAccount) => ({ kind: "account", id: gmailAccount.id, name: "Gmail" })),
  async connect() {
    await loginGmailBridge();
  },
  async disconnect() {
    void null;
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.gmail} />,
};
