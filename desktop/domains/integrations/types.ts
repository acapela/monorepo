import { ReactNode } from "react";

export interface IntegrationClient {
  kind: "integration";
  name: string;
  description: string;
  icon: ReactNode;
  customUrlSchemeProtocol?: string;
  getCanConnect?(): boolean;
  getIsConnected(): boolean;
  connect(): Promise<void>;
  disconnect?(): Promise<void>;
  additionalSettings?: ReactNode;
}
