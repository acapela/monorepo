import { ReactNode } from "react";

import { OpenAppUrl } from "@aca/desktop/bridge/apps";
import { NotificationEntity, NotificationInner } from "@aca/desktop/clientdb/notification";

export type IntegrationAccount = { kind: "account"; id: string; name: string };

export interface IntegrationClient {
  kind: "integration";
  // TODO: might be incorrect if one integration supports multiple types
  notificationTypename: NotificationInner["__typename"];
  name: string;
  description: string;
  icon: ReactNode;
  convertToLocalAppUrl?: (notification: NotificationEntity) => Promise<OpenAppUrl>;
  getIsDisabled?: () => boolean;
  getIsConnected: () => boolean;
  // Returns false if an account is already connected and this integration only supports a single account
  getCanConnect?(): boolean;
  getAccounts(): IntegrationAccount[];
  getWorkspaces?(): string[];
  getComposeURLs?(): { accountId: string; url: string }[];
  connect(accountId?: string): Promise<void>;
  disconnect?(accountId: string): Promise<void>;
  additionalSettings?: ReactNode;
  isHiddenFromSettings?: boolean;
}
