import {
  requestAttachPreview,
  requestPreviewFocus,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";

import { getPreviewManager } from "./previewQueue";

const log = makeLogger("BrowserView");

/**
 * Here we initialize client bridge handlers for previews
 */
export function initPreviewHandler() {
  requestPreviewPreload.handle(async ({ url, priority }) => {
    const { cancel } = getPreviewManager(url);

    return cancel;
  });

  requestAttachPreview.handle(async ({ url, position }, event) => {
    assert(event, "Show browser view can only be called from client side", log.error);

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view", log.error);

    log.debug("will attach view", { url, position });

    const { cancel, item: manager } = getPreviewManager(url);

    const detachFromWindow = manager.attachToWindow(targetWindow, position);

    return () => {
      // !important - detach should be called first (before cancel). Cancel might destroy browser view
      detachFromWindow();
      cancel();
    };
  });

  updatePreviewPosition.handle(async ({ position, url }) => {
    const aliveManager = getPreviewManager.getExistingOnly(url);

    if (!aliveManager) return;

    log.debug("updating preview position requirements", position);

    if (!aliveManager.currentWindowAttachment) {
      log.warn("trying to update preview size, but preview is not attached to any window");
    }

    aliveManager.currentWindowAttachment?.updatePosition(position);
  });

  requestPreviewFocus.handle(async ({ url }) => {
    const aliveManager = getPreviewManager.getExistingOnly(url);

    if (!aliveManager) return;

    aliveManager.currentWindowAttachment?.focus();
  });
}
