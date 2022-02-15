import { IComputedValue, IObservableValue } from "mobx";
import { ReactNode } from "react";

import { OpenAppUrl } from "@aca/desktop/bridge/apps";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";

export interface IntegrationClient {
  kind: "integration";
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
