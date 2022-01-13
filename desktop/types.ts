export type Notification = {
  id: string;
  title: string;
  url: string;
  isUnread: boolean;
};

export type NotificationServiceStatus<WithOAuth extends boolean> =
  | "no-session"
  | "dead-session"
  | "connected"
  | (WithOAuth extends true ? "missing-oauth" : never);

export type NotificationServiceAdapter<NeedsBackend extends boolean> = {
  needsBackend: NeedsBackend;
  checkStatus: () => Promise<NotificationServiceStatus<NeedsBackend>>;
  login: () => Promise<boolean>;
  sync: (addFn: (notification: Notification) => void) => void;

  archive: (id: string) => Promise<void>;
} & NeedsBackend extends true
  ? { openOAuth: () => Promise<boolean> }
  : {};
