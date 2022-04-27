import React from "react";

import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { getDb } from "@aca/desktop/clientdb";

import { IntegrationIcon } from "./IntegrationIcon";
import { IntegrationClient } from "./types";

export const googleDriveIntegrationClient: IntegrationClient = {
  isHiddenFromSettings: true,
  kind: "integration",
  notificationTypename: "notification_drive",
  name: "Drive",
  description: "Google Drive Notifications",
  getIsDisabled: () => !getDb().gmailAccount.hasItems,
  getIsConnected: () => false,
  getCanConnect: () => false,
  getAccounts: () =>
    getDb().gmailAccount.all.map((gmailAccount) => ({ kind: "account", id: gmailAccount.id, name: "Drive" })),
  connect() {
    return Promise.resolve();
  },
  icon: <IntegrationIcon imageUrl={integrationLogos.drive} />,
};
