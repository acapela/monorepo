import { ReactNode } from "react";

import { IntegrationClient } from "@aca/desktop/domains/integrations/types";

export interface OnboardingNotificationRowData {
  integration: IntegrationClient;
  author: string;
  target: string;
  timeAgoSent: string;
  content: ReactNode;
  onResolve?: (notification: OnboardingNotificationRowData) => void;
  onSnooze?: (notification: OnboardingNotificationRowData) => void;
  onOpen?: (notification: OnboardingNotificationRowData) => void;
}

export interface FakeNotificationData {
  title: string;
  integrationClient: IntegrationClient;
}
