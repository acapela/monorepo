export type Notification = {
  service: string;
  id: string;
  title: string;
  path: string;
  isUnread: boolean;
};

export type NotificationServiceStatus = "no-session" | "dead-session" | "connected" | "missing-oauth";

export type NotificationServiceAdapter = {
  needsBackend: boolean;
  checkStatus: () => Promise<NotificationServiceStatus>;
  login: () => Promise<boolean>;
  update: (addFn: (notification: Notification) => void) => void;
  sync: () => Promise<Notification[]>;
  archive: (id: string) => Promise<void>;
  openOAuth: () => Promise<boolean>;
};
