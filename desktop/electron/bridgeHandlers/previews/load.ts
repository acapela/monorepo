import { BrowserView } from "electron";

import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { loadURLWithFilters } from "./siteFilters";

const log = makeLogger("Preview Manager");

export async function loadPreviewIfNeeded(browserView: BrowserView, url: string) {
  const currentLoadState = preloadingNotificationsBridgeChannel.get()[url];

  if (currentLoadState === "loading" || currentLoadState === "ready") return;

  try {
    preloadingNotificationsBridgeChannel.update({ [url]: "loading" });
    await loadURLWithFilters(browserView, url);
    preloadingNotificationsBridgeChannel.update({ [url]: "ready" });
  } catch (error) {
    if (browserView.webContents.isDestroyed()) {
      preloadingNotificationsBridgeChannel.update((state) => {
        delete state[url];
      });
      return;
    }

    previewEventsBridge.send({ type: "load-error", url });

    preloadingNotificationsBridgeChannel.update({ [url]: "error" });

    log.error(error, `Failed to load preview`);

    throw error;
  }
}
