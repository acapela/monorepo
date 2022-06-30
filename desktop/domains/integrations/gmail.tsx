import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { loginGmailBridge } from "@aca/desktop/bridge/auth";
import { getDb, getNullableDb } from "@aca/desktop/clientdb";
import { gmailAccountEntity } from "@aca/desktop/clientdb/notification/gmail/account";
import { notificationGmailEntity } from "@aca/desktop/clientdb/notification/gmail/message";

import { IntegrationClient } from "./types";

export const gmailIntegrationClient: IntegrationClient = {
  kind: "integration",
  notificationTypename: "notification_gmail",
  name: "Google Gmail",
  description:
    "New emails and Google Suite notifications. Beware that imported emails will be marked as read in Gmail.",
  getIsConnected: () => getNullableDb()?.entity(gmailAccountEntity).hasItems ?? false,
  getCanConnect: () => !getNullableDb()?.entity(gmailAccountEntity).hasItems ?? false,
  getAccounts: () =>
    getNullableDb()
      ?.entity(gmailAccountEntity)
      .all.map((gmailAccount) => ({
        kind: "account",
        id: gmailAccount.id,
        name: gmailAccount.account!.email!,
      })) ?? [],
  async connect() {
    await loginGmailBridge();
  },
  async disconnect() {
    const db = getDb();
    for (const account of db.entity(gmailAccountEntity).all) {
      account.remove();
    }
    for (const gmailNotification of db.entity(notificationGmailEntity).all) {
      gmailNotification.notification?.remove("sync");
    }
  },
  imageURL: integrationLogos.gmail,
  isForUltimateUsers: true,
};
