import { NotificationServiceName } from "../electron/services";
import { NotificationServiceStatus } from "../types";
import { createChannelBridge, createInvokeBridge } from "./base/channels";

export const notificationServiceStatusChannel =
  createChannelBridge<Record<string, NotificationServiceStatus>>("notification-service-status");

export const getNotification = createInvokeBridge<{ type: NotificationServiceName; internalId: string }, Notification>(
  "get-notification-data"
);

export const loginToService = createInvokeBridge<Boolean, NotificationServiceName>("login-to-service");
