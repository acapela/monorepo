import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { mapGetOrCreate } from "@aca/shared/map";
import { SECOND } from "@aca/shared/time";

import { PreviewManager, createPreviewManager } from "./previewManager";
import { warmupQueue } from "./warmupQueue";

/**
 * How many previews are allowed to be alive at any time.
 */
const MAX_PRELOADING_COUNT = 10;

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

/**
 * We keep map about preloading priority.
 *
 * Attaching views always have top priority.
 *
 * Preload items can manually set it up.
 */
const preloadingPriorityMap = new Map<string, number>();

export function setPreloadingPriority(url: string, priority: number) {
  preloadingPriorityMap.set(url, priority);
}

const previewPreloadQueue = warmupQueue<PreviewManager>({
  maxItems: MAX_PRELOADING_COUNT,
  timeout: SECOND * 30,
  getPriority(manager) {
    return preloadingPriorityMap.get(manager.url) ?? PreviewLoadingPriority.following;
  },
  initialize(manager) {
    informURLLoading(manager.url, true);
    manager.preload().then(() => {
      informURLLoading(manager.url, true, true);
    });

    //
  },
  cleanup(manager) {
    manager.destroy();
    alivePreviewManagers.delete(manager.url);
    informURLLoading(manager.url, false);
  },
});

const alivePreviewManagers = new Map<string, PreviewManager>();

const createOrReusePreviewManager = (url: string) => {
  return mapGetOrCreate(alivePreviewManagers, url, () => createPreviewManager(url));
};

export function getAlivePreviewManager(url: string) {
  return alivePreviewManagers.get(url) ?? null;
}

export function addPreviewWarmupRequest(url: string) {
  const manager = createOrReusePreviewManager(url);
  const stopRequesting = previewPreloadQueue.request(manager);

  return {
    manager,
    stopRequesting,
  };
}
