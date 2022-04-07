import { BrowserView } from "electron";

import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { evaluateFunctionInWebContents } from "../../utils/webContentsLink";
import { markLoadRequestedTime } from "./instrumentation";
import { loadURLWithFilters } from "./siteFilters";

const log = makeLogger("Preview Manager");

async function ensureBrowserViewHasBackground(view: BrowserView) {
  await evaluateFunctionInWebContents(view.webContents, () => {
    const color = getComputedStyle(document.body).backgroundColor;
    if (color === "rgba(0, 0, 0, 0)") {
      document.body.style.backgroundColor = "#fff";
    }
  });
}

export async function loadPreviewIfNeeded(browserView: BrowserView, url: string) {
  const currentLoadState = preloadingNotificationsBridgeChannel.get()[url];

  if (currentLoadState === "loading" || currentLoadState === "ready") return;

  return await forceLoadPreview(browserView, url);
}

export async function forceLoadPreview(browserView: BrowserView, url: string) {
  try {
    markLoadRequestedTime(browserView, url);
    preloadingNotificationsBridgeChannel.update({ [url]: "loading" });
    await loadURLWithFilters(browserView, url);
    await ensureBrowserViewHasBackground(browserView);
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
