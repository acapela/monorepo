import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getNullableDb } from "@aca/desktop/clientdb";

import { IntegrationClient } from "./types";

export const googleDriveIntegrationClient: IntegrationClient = {
  isHiddenFromSettings: true,
  kind: "integration",
  notificationTypename: "notification_drive",
  name: "Google Suite",
  description: "Google Suite Notifications",
  getIsConnected: () => false,
  getCanConnect: () => false,
  getAccounts: () => {
    return (
      getNullableDb()?.gmailAccount.all.map((gmailAccount) => ({
        kind: "account",
        id: gmailAccount.id,
        name: "Drive",
      })) ?? []
    );
  },
  connect() {
    return Promise.resolve();
  },
  imageURL: integrationLogos.googleSuite,
};
