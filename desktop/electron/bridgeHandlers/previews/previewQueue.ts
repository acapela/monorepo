import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";

import { createPreviewManager } from "./previewManager";
import { memoizeWithCleanup } from "./warmupQueue";

/**
 * Bridge informing UI about loading state
 */
function informURLLoading(url: string, isLoading: boolean, isReady?: boolean) {
  const urls = preloadingNotificationsBridgeChannel.get();

  if (isLoading) {
    preloadingNotificationsBridgeChannel.update((data) => (data[url] = isReady ? "ready" : "loading"));
  }

  if (!isLoading && urls[url]) {
    preloadingNotificationsBridgeChannel.update((data) => {
      delete data[url];
    });
  }
}

export const getPreviewManager = memoizeWithCleanup(
  (url: string) => {
    return createPreviewManager(url);
  },
  {
    keyGetter: (url) => url,
    cleanup(manager) {
      return manager.destroy();
    },
  }
);
