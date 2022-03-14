import {
  requestAttachPreview,
  requestPreviewFocus,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";

import { attachPreview } from "./attach";
import { requestPreviewBrowserView } from "./browserView";
import { setViewPosition } from "./position";

const log = makeLogger("BrowserView");

/**
 * Here we initialize client bridge handlers for previews
 */
export function initPreviewHandler() {
  requestPreviewPreload.handle(async ({ url }) => {
    const { cancel } = requestPreviewBrowserView(url);

    return cancel;
  });

  requestAttachPreview.handle(async ({ url, position }, event) => {
    assert(event, "Show browser view can only be called from client side", log.error);

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view", log.error);

    log.debug("will attach view", { url, position });

    const { cancel: cancelPreloadingRequest, item: browserView } = requestPreviewBrowserView(url);

    const detach = attachPreview(browserView, targetWindow);

    setViewPosition(browserView, position);

    return () => {
      // !important - detach should be called first (before cancel). Cancel might destroy browser view and detaching destroyed view might throw
      detach();
      cancelPreloadingRequest();
    };
  });

  updatePreviewPosition.handle(async ({ position, url }) => {
    const browserView = requestPreviewBrowserView.getExistingOnly(url);

    if (!browserView) return;

    log.debug("updating preview position requirements", position);

    return setViewPosition(browserView, position);
  });

  requestPreviewFocus.handle(async ({ url }) => {
    const browserView = requestPreviewBrowserView.getExistingOnly(url);

    if (!browserView) return;

    browserView.webContents?.focus();
  });
}
