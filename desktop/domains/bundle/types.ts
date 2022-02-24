import { ReactNode } from "react";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";

interface NotificationBundleInput {
  pointer: Record<string, unknown>;
  icon: ReactNode;
  notifications: NotificationEntity[];
  contextLabel: string;
  title: string;
  snippet?: string;
  treatAsOne: boolean;
}

interface NotificationBundle extends NotificationBundleInput {
  parent?: NotificationBundle;
  childBundles: NotificationBundle[];
}
