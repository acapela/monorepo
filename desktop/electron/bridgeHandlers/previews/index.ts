import {
  requestAttachPreview,
  requestPreviewFocus,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";

import { addPreviewWarmupRequest, getAlivePreviewManager, setPreloadingPriority } from "./previewQueue";

const log = makeLogger("BrowserView");

/**
 * Here we initialize client bridge handlers for previews
 */
export function initPreviewHandler() {
  requestPreviewPreload.handle(async ({ url, priority }) => {
    setPreloadingPriority(url, priority);
    const { stopRequesting } = addPreviewWarmupRequest(url);

    return stopRequesting;
  });

  requestAttachPreview.handle(async ({ url, position }, event) => {
    /**
     * When attaching - always demand top-priority for preloading
     *
     * This avoids situation when eg. in focus mode 'previous' item has bigger loading priority
     * than current one.
     */
    setPreloadingPriority(url, PreviewLoadingPriority.current);
    assert(event, "Show browser view can only be called from client side", log.error);

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view", log.error);

    log.debug("will attach view", { url, position });

    const { stopRequesting, manager } = addPreviewWarmupRequest(url);

    const detachFromWindow = manager.attachToWindow(targetWindow, position);

    return () => {
      stopRequesting();
      detachFromWindow();
    };
  });

  updatePreviewPosition.handle(async ({ position, url }) => {
    const aliveManager = getAlivePreviewManager(url);

    if (!aliveManager) return;

    log.debug("updating preview position requirements", position);

    if (!aliveManager.currentWindowAttachment) {
      log.warn("trying to update preview size, but preview is not attached to any window");
    }

    aliveManager.currentWindowAttachment?.updatePosition(position);
  });

  requestPreviewFocus.handle(async ({ url }) => {
    const aliveManager = getAlivePreviewManager(url);

    if (!aliveManager) return;

    aliveManager.currentWindowAttachment?.focus();
  });
}
