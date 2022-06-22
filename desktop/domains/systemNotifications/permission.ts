import { memoize } from "lodash";

export const requestNotificationsPermissionIfNeeded = memoize(function requestNotificationsPermission() {
  Notification.requestPermission();
});
