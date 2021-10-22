import { Page } from "@playwright/test";

import { wait } from "~shared/time";

export const isSentryStoreURL = (url: URL) => url.host.endsWith("sentry.io") && url.pathname.includes("/store");

export async function createNetworkListener(page: Page, thresholdMs = 500) {
  let lastActivityAt = Date.now();
  await page.on("request", () => {
    lastActivityAt = Date.now();
  });
  await page.on("response", () => {
    lastActivityAt = Date.now();
  });
  await page.on("websocket", (socket) => {
    socket.on("framereceived", () => {
      lastActivityAt = Date.now();
    });
  });

  const networkListener = {
    waitForIdle(): Promise<void> {
      const msSinceLastActivity = Date.now() - lastActivityAt;
      if (msSinceLastActivity > thresholdMs) {
        return Promise.resolve();
      } else {
        return wait(msSinceLastActivity).then(networkListener.waitForIdle);
      }
    },
  };

  return networkListener;
}
