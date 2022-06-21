import { memoize } from "lodash";

export const requestNotificationsPermission = memoize(function requestNotificationsPermission() {
  new Notification("");

  Notification.requestPermission();
});
