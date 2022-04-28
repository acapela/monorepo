import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { getDb } from "@aca/desktop/clientdb";
import { accountStore } from "@aca/desktop/store/account";
import { isGmailIncludedInPlan } from "@aca/shared/google";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const gmailIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_gmail",
  name: "Gmail",
  description: "New emails",
  getIsDisabled: () => !isGmailIncludedInPlan(accountStore.user?.subscription_plan),
  getIsConnected: () => getDb().gmailAccount.hasItems,
  getCanConnect: () => !getDb().gmailAccount.hasItems,
  getAccounts: () =>
    getDb().gmailAccount.all.map((gmailAccount) => ({
      kind: "account",
      id: gmailAccount.id,
      name: gmailAccount.account!.email!,
    })),
  getComposeURLs: () =>
    getDb().gmailAccount.all.map((gmailAccount) => ({
      accountId: gmailAccount.id,
      url: "https://mail.google.com/mail/u/0/?fs=1&to=&su=&body=&tf=cm",
    })),
  async connect() {
    await loginGmailBridge();
  },
  async disconnect() {
    const db = getDb();
    for (const account of db.gmailAccount.all) {
      account.remove();
    }
    for (const gmailNotification of db.notificationGmail.all) {
      gmailNotification.notification?.remove("sync");
    }
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.gmail} />,
};
