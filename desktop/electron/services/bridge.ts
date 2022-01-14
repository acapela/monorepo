import { loginToService } from "@aca/desktop/bridge/notificationServices";

import { notionServiceAdapter } from "./notion";

export function initializeNotificationBridge() {
  loginToService.handle(async function loginToService(serviceName) {
    if (serviceName === "notion") {
      return notionServiceAdapter.login();
    }
    return Promise.resolve(false);
  });
}
