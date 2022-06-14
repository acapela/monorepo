import { BrowserView } from "electron";

import { preloadingPreviewsBridgeChannel, previewEventsBridge } from "@aca/desktop/bridge/preview";
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
  const currentLoadState = preloadingPreviewsBridgeChannel.get()[url];

  if (!currentLoadState || currentLoadState === "error") {
    return await forceLoadPreview(browserView, url);
  }
}

export async function forceLoadPreview(browserView: BrowserView, url: string) {
  try {
    markLoadRequestedTime(browserView, url);
    preloadingPreviewsBridgeChannel.update({ [url]: "loading" });
    await loadURLWithFilters(browserView, url);
    await ensureBrowserViewHasBackground(browserView);
    preloadingPreviewsBridgeChannel.update({ [url]: "ready" });
  } catch (error) {
    if (browserView.webContents.isDestroyed()) {
      preloadingPreviewsBridgeChannel.update((state) => {
        delete state[url];
      });
      return;
    }

    previewEventsBridge.send({ type: "load-error", url });

    preloadingPreviewsBridgeChannel.update({ [url]: "error" });

    log.error(error, `Failed to load preview`);

    throw error;
  }
}
