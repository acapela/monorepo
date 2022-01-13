interface NotificationService {
  name: string;
  withOauth: boolean;
}

export const NOTION_SERVICE: NotificationService = { name: "notion", withOauth: false };

export const LOOM_SERVICE: NotificationService = { name: "loom", withOauth: false };

export const DRIVE_SERVICE: NotificationService = { name: "google-drive", withOauth: true };

export const SUPPORTED_SERVICES = [NOTION_SERVICE, LOOM_SERVICE, DRIVE_SERVICE] as const;

export type SupportedServices = typeof SUPPORTED_SERVICES[number];
