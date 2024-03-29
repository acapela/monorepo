import { ReactNode } from "react";

import { OpenAppUrl } from "@aca/desktop/bridge/apps";
import { NotificationEntity, NotificationInner } from "@aca/desktop/clientdb/notification";

export type IntegrationAccount = { kind: "account"; id: string; name: string; imageURL?: string };

export interface IntegrationClient {
  kind: "integration";
  // TODO: might be incorrect if one integration supports multiple types
  notificationTypename: NotificationInner["__typename"];
  name: string;
  description: string;
  imageURL: string;
  convertToLocalAppUrl?: (notification: NotificationEntity) => Promise<OpenAppUrl>;
  getIsConnected: () => boolean;
  // Returns false if an account is already connected and this integration only supports a single account
  getCanConnect?(): boolean;
  getAccounts(): IntegrationAccount[];
  getWorkspaces?(): string[];
  connect(accountId?: string): Promise<void>;
  disconnect?(accountId: string): Promise<void>;
  additionalSettings?: ReactNode;
  isHiddenFromSettings?: boolean;
  isHiddenFromSidebar?(): boolean;
  isForUltimateUsers?: boolean;
  requiresReconnection?(): boolean;
}
