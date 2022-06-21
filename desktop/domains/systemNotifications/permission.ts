import { memoize } from "lodash";

export const requestNotificationsPermissionIfNeeded = memoize(function requestNotificationsPermission() {
  new Notification("");

  Notification.requestPermission();
});
