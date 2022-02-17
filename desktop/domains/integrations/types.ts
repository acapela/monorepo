import { IComputedValue, IObservableValue } from "mobx";
import { ReactNode } from "react";

import { OpenAppUrl } from "@aca/desktop/bridge/apps";
import { NotificationEntity, NotificationInner } from "@aca/desktop/clientdb/notification";

export interface IntegrationClient {
  kind: "integration";
  // TODO: might be incorrect if one integration supports multiple types
  notificationTypename: NotificationInner["__typename"];
  name: string;
  description: string;
  icon: ReactNode;
  convertToLocalAppUrl?: (notification: NotificationEntity) => Promise<OpenAppUrl>;
  isReady: IObservableValue<boolean> | IComputedValue<boolean>;
  getCanConnect?(): boolean;
  getIsConnected(): boolean;
  connect(): Promise<void>;
  disconnect?(): Promise<void>;
  additionalSettings?: ReactNode;
}
