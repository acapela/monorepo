import { ReactNode } from "react";

export interface IntegrationClient {
  kind: "integration";
  name: string;
  description: string;
  icon: ReactNode;
  convertToLocalAppUrl?: (url: string) => Promise<string>;
  getCanConnect?(): boolean;
  getIsConnected(): boolean;
  connect(): Promise<void>;
  disconnect?(): Promise<void>;
  additionalSettings?: ReactNode;
}
