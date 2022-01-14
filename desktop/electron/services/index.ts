export type NotificationServiceName = "notion";
export interface NotificationService {
  name: NotificationServiceName;
  withOauth: boolean;
}

export const NOTION_SERVICE: NotificationService = { name: "notion", withOauth: false };

// export const LOOM_SERVICE: NotificationService = { name: "loom", withOauth: false };

// export const DRIVE_SERVICE: NotificationService = { name: "google-drive", withOauth: true };

// export const SUPPORTED_SERVICES = [NOTION_SERVICE, LOOM_SERVICE, DRIVE_SERVICE] as const;

// Temporary
export const SUPPORTED_SERVICES = [NOTION_SERVICE] as const;

export type SupportedService = typeof SUPPORTED_SERVICES[number];
