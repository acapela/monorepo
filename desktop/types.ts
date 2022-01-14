export type Notification = {
  serviceId: string;
  internalId: string;
  title: string;
  url: string;
  isUnread: boolean;
};

export type NotificationServiceStatus = "no-session" | "dead-session" | "connected" | "missing-oauth";

export type NotificationServiceAdapter = {
  needsBackend: boolean;
  checkStatus: () => Promise<NotificationServiceStatus>;
  login: () => Promise<boolean>;
  sync: (addFn: (notification: Notification) => void) => void;
  archive: (id: string) => Promise<void>;
  openOAuth: () => Promise<boolean>;
};
