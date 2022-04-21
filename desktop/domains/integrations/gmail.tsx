import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";
import { isGmailIncludedInPlain } from "@aca/shared/google";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const gmailIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_gmail",
  name: "Gmail",
  description: "New emails",
  getIsDisabled: () => !isGmailIncludedInPlain(accountStore.user?.subscription_plan),
  getIsConnected: () => getDb().gmailAccount.hasItems,
  getCanConnect: () => !getDb().gmailAccount.hasItems,
  getAccounts: () =>
    getDb().gmailAccount.all.map((gmailAccount) => ({ kind: "account", id: gmailAccount.id, name: "Gmail" })),
  async connect() {
    await loginGmailBridge();
  },
  async disconnect() {
    for (const account of getDb().gmailAccount.all) {
      account.remove();
    }
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.gmail} />,
};
