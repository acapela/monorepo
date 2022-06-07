import { appLogo } from "@aca/desktop/assets";

import { IntegrationClient } from "./types";

export const acapelaIntegrationClient: IntegrationClient = {
  isHiddenFromSettings: true,
  kind: "integration",
  notificationTypename: "notification_acapela",
  name: "Acapela",
  description: "Announcement and Updates from Acapela",
  getIsConnected: () => false,
  getCanConnect: () => false,
  getAccounts: () => [
    {
      kind: "account",
      id: "Acapela-Notifications",
      name: "Acapela",
    },
  ],
  connect() {
    return Promise.resolve();
  },
  imageURL: appLogo,
};
