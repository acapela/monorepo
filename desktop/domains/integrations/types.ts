import { ReactNode } from "react";

export interface IntegrationClient {
  kind: "integration";
  name: string;
  description: string;
  icon: ReactNode;
  getCanConnect?(): boolean;
  getIsConnected(): boolean;
  connect(): Promise<void>;
  additionalSettings?: ReactNode;
}
