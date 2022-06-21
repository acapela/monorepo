import { ReactNode } from "react";

import { IntegrationClient } from "@aca/desktop/domains/integrations/types";
import { NotificationTag } from "@aca/desktop/domains/tag/tag";

export interface OnboardingNotificationRowData {
  integration: IntegrationClient;
  author: string;
  timeAgoSent: string;
  content: ReactNode;
  tags?: NotificationTag[];
  onResolve?: (notification: OnboardingNotificationRowData) => void;
  onAddReminder?: (notification: OnboardingNotificationRowData) => void;
  onOpen?: (notification: OnboardingNotificationRowData) => void;
}

export interface FakeNotificationData {
  title: string;
  integrationClient: IntegrationClient;
}
