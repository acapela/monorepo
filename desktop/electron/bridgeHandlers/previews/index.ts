import {
  requestAttachPreview,
  requestEmbedPreload,
  requestForceReloadPreview,
  requestPreviewFocus,
  requestSetPreviewOnTopState,
  startPreviewAnimation,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";

import { setBrowserViewZIndex } from "../../windows/viewZIndex";
import { attachPreview } from "./attach";
import { requestPreviewBrowserView } from "./browserView";
import { markViewAttachedTime } from "./instrumentation";
import { forceLoadPreview, loadPreviewIfNeeded } from "./load";
import { animateHorizontalPreviewSwipe, animateVerticalPreviewSwipe, setViewPosition } from "./position";

const log = makeLogger("BrowserView");

/**
 * Here we initialize client bridge handlers for previews
 */
export function initPreviewHandler() {
  requestEmbedPreload.handle(async ({ url }) => {
    const { cancel, item: browserView } = requestPreviewBrowserView(url);

    loadPreviewIfNeeded(browserView, url);

    return cancel;
  });

  requestAttachPreview.handle(async ({ url, position, skipPositionUpdate }, event) => {
    assert(event, "Show browser view can only be called from client side", log.error);

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view", log.error);

    log.debug("will attach view", { url, position });

    const { cancel: cancelPreloadingRequest, item: browserView } = requestPreviewBrowserView(url);

    loadPreviewIfNeeded(browserView, url);

    markViewAttachedTime(browserView);
    const detach = attachPreview(browserView, targetWindow);

    if (!skipPositionUpdate) {
      setViewPosition(browserView, position);
    }

    return () => {
      // !important - detach should be called first (before cancel). Cancel might destroy browser view and detaching destroyed view might throw
      detach();
      cancelPreloadingRequest();
    };
  });

  startPreviewAnimation.handle(async ({ start, end, animation }) => {
    if (start.url === end.url) {
      const endView = requestPreviewBrowserView.getExistingOnly(end.url);
      if (!endView) return;
      setViewPosition(endView, end.position);
      return;
    }

    const startView = requestPreviewBrowserView.getExistingOnly(start.url);
    const endView = requestPreviewBrowserView.getExistingOnly(end.url);

    if (!startView || !endView) {
      return;
    }

    if (animation === "swipe-up" || animation === "swipe-down") {
      const viewProps =
        animation === "swipe-up"
          ? { topView: startView, bottomView: endView }
          : { topView: endView, bottomView: startView };

      await animateVerticalPreviewSwipe({ ...viewProps, position: end.position, direction: animation });
    }

    if (animation === "swipe-left" || animation === "swipe-right") {
      const viewProps =
        animation === "swipe-left"
          ? { leftView: startView, rightView: endView }
          : { leftView: endView, rightView: startView };

      await animateHorizontalPreviewSwipe({ ...viewProps, position: end.position, direction: animation });
    }
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

  requestForceReloadPreview.handle(async ({ url }) => {
    const browserView = requestPreviewBrowserView.getExistingOnly(url);

    if (!browserView) return;

    await forceLoadPreview(browserView, url);
  });

  requestSetPreviewOnTopState.handle(async ({ url, state }, event) => {
    assert(event, "Show browser view can only be called from client side", log.error);

    const targetWindow = getSourceWindowFromIPCEvent(event);

    assert(targetWindow, "No target window for showing browser view", log.error);

    const browserView = requestPreviewBrowserView.getExistingOnly(url);

    if (!browserView) return;

    if (state === "preview-on-top") {
      setBrowserViewZIndex(browserView, "aboveMainView");
    }

    if (state === "app-on-top") {
      setBrowserViewZIndex(browserView, "belowMainView");
    }
  });
}
