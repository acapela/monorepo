import { notificationResolvedChannel } from "@aca/desktop/bridge/notification";

export function initializeFigmaPush() {
  notificationResolvedChannel.subscribe((event) => {
    console.info({ event });
    if (event.inner.__typename !== "notification_figma_comment") return;
  });
}
