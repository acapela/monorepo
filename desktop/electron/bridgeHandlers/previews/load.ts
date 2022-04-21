import { BrowserView } from "electron";

import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { evaluateFunctionInWebContents } from "../../utils/webContentsLink";
import { markLoadRequestedTime } from "./instrumentation";
import { loadURLWithFilters } from "./siteFilters";

const RETRY_ATTEMPTS = 5;
const NORMAL_RETRY_MS = 500;
const ABORT_RETRY_MS = 50;

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

export async function forceLoadPreview(browserView: BrowserView, url: string, attempt = 0): Promise<void> {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isAbortError = (error as any)?.message.includes("ERR_ABORTED");

    if (!isAbortError) {
      previewEventsBridge.send({ type: "load-error", url });

      preloadingNotificationsBridgeChannel.update({ [url]: "error" });
    }

    if (attempt < RETRY_ATTEMPTS) {
      // We sometimes get ERR_ABORTED from Gmail and we want to retry quickly in that case
      await new Promise((resolve) => setTimeout(resolve, isAbortError ? ABORT_RETRY_MS : NORMAL_RETRY_MS));

      return forceLoadPreview(browserView, url, isAbortError ? attempt : attempt + 1);
    } else {
      log.error(error, `Failed to load preview`);
      throw error;
    }
  }
}
