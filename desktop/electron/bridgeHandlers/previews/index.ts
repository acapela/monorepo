import {
  requestAttachPreview,
  requestPreviewFocus,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";
import { createLogger } from "@aca/shared/log";

import { addPreviewWarmupRequest, getAlivePreviewManager } from "./previewQueue";

const log = createLogger("BrowserView");

export function initPreviewHandler() {
  requestPreviewPreload.handle(async ({ url }) => {
    const { stopRequesting } = addPreviewWarmupRequest(url);

    return stopRequesting;
  });

  requestAttachPreview.handle(async ({ url, position }, event) => {
    assert(event, "Show browser view can only be called from client side");

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view");

    log("will attach view", { url, position });

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

    log("updating preview position requirements", position);

    aliveManager.currentWindowAttachment?.updatePosition(position);
  });

  requestPreviewFocus.handle(async ({ url }) => {
    const aliveManager = getAlivePreviewManager(url);

    console.log("FOC", { url, aliveManager });

    if (!aliveManager) return;

    aliveManager.currentWindowAttachment?.focus();
  });
}
