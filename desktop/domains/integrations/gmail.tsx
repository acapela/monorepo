import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { getDb, getNullableDb } from "@aca/desktop/clientdb";

import { IntegrationClient } from "./types";

export const gmailIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_gmail",
  name: "Google Gmail",
  description:
    "New emails and Google Suite notifications. Beware that imported emails will be marked as read in Gmail.",
  getIsConnected: () => getNullableDb()?.gmailAccount.hasItems ?? false,
  getCanConnect: () => !getNullableDb()?.gmailAccount.hasItems ?? false,
  getAccounts: () =>
    getNullableDb()?.gmailAccount.all.map((gmailAccount) => ({
      kind: "account",
      id: gmailAccount.id,
      name: gmailAccount.account!.email!,
    })) ?? [],
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
  imageURL: integrationLogos.gmail,
  isForUltimateUsers: true,
};
