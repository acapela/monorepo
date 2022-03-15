export interface ScheduledNotification {
  date: Date;
  title: string;
  body?: string;
  onClick?: (notification: Notification) => void;
  onShown?: () => void;
}
