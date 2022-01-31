import { BrowserView, BrowserWindow } from "electron";
import { isEqual } from "lodash";

import {
  previewEventsBridge,
  requestAttachPreview,
  requestPreviewPreload,
  updatePreviewPosition,
} from "@aca/desktop/bridge/preview";
import { PreviewPosition } from "@aca/desktop/domains/preview";
import { getSourceWindowFromIPCEvent } from "@aca/desktop/electron/utils/ipc";
import { assert } from "@aca/shared/assert";
import { createLogger } from "@aca/shared/log";
import { mapGetOrCreate } from "@aca/shared/map";
import { getUUID } from "@aca/shared/uuid";

import { listenToWebContentsFocus } from "../../utils/webContentsLink";
import { loadURLWithFilters } from "./siteFilters";

const DESTROY_BROWSER_VIEW_TIMEOUT_MS = 5000;

type StringURL = string;

interface AlivePreviewState {
  readonly url: string;
  readonly window: BrowserWindow;
  readonly view: BrowserView;
  readonly subscribers: Set<string>;
  readonly loadingPromise: Promise<void>;
  destroyTimeout: null | ReturnType<typeof setTimeout>;
  position: PreviewPosition | null;
}

const alivePreviews = new Map<StringURL, AlivePreviewState>();

const log = createLogger("BrowserView");

/**
 * Requests preview for given url to be loaded.
 *
 * Will initialize new view if one is not present, or will re-use existing one.
 *
 * Returns function to stop requesting and inform 'url preview is not needed anymore'.
 *
 * If every request is stopped, view will be scheduled to be destroyed.
 *
 * Returns preview state object and function to stop requesting.
 *
 * Note: it is possible that multiple places will request the same url to be 'warm'
 */
function requestPreviewLoad(url: string, window: BrowserWindow) {
  /**
   * Each request has unique id. This allows making sure each request can be cancelled only once to avoid race conditions.
   *
   * This ID is not published to avoid making it possible to introduce concurrency bugs.
   *
   * It is only used in returned 'cancel' function.
   */
  const requestId = getUUID();

  // Get existing or create preview state
  const preview = mapGetOrCreate(alivePreviews, url, () => {
    const browserView = new BrowserView({ webPreferences: {} });
    const loadingPromise = loadURLWithFilters(browserView, url);

    browserView.webContents.on("before-input-event", (event, input) => {
      if (input.type === "keyDown" && input.key === "Escape" && isEqual(input.modifiers, ["meta"])) {
        window.webContents.focus();
      }
    });

    listenToWebContentsFocus(browserView.webContents, (isFocused) => {
      previewEventsBridge.send({ url, type: isFocused ? "focus" : "blur" });
    });

    log("Initializing preview for url", url);
    return {
      url,
      window,
      view: browserView,
      loadingPromise,
      subscribers: new Set<string>(),
      destroyTimeout: null,
      position: null,
    };
  });

  // Register id of this request as needing this URL preview
  preview.subscribers.add(requestId);

  /**
   * If view was already scheduled to be destroyed, stop it from doing so.
   *
   * This can happen if: url requested > url not requested > waiting a bit to be destroyed > before destroyed was requested again
   */
  if (preview.destroyTimeout) {
    log(`cancel planned preview destroy ${url}`);
    clearTimeout(preview.destroyTimeout);
    preview.destroyTimeout = null;
  }

  // Returned function that allows informing that this request is not active anymore
  function unregister() {
    // Don't allow calling it twice.
    assert(preview.subscribers.has(requestId), "Preview was already unregistered");
    preview.subscribers.delete(requestId);

    // This preview is still requested somewhere else - dont kill it
    if (preview.subscribers.size > 0) {
      return;
    }

    assert(!preview.destroyTimeout, "Bad state - for some reason view destroy was scheduled twice");

    log(`schedule preview destroy ${url}`);
    preview.destroyTimeout = setTimeout(() => {
      log("destroying view", preview.url);
      destroyBrowserView(preview.view);
      // Remove it from map of active previews so it'll be re-created next time
      alivePreviews.delete(preview.url);
    }, DESTROY_BROWSER_VIEW_TIMEOUT_MS);
  }

  return [preview, unregister] as const;
}

/**
 * Will attach preview to given window at given initial position.
 *
 * Returns function that will detach it.
 *
 * Also handles parent window resizing and properly adjusting view position and size.
 */
async function attachPreviewToWindow(url: string, initialPosition: PreviewPosition, targetWindow: BrowserWindow) {
  // Request preload in case it was not requested before
  const [preview, stopRequestingPreload] = await requestPreviewLoad(url, targetWindow);

  // Should never happen, but make sure to throw early if it does.
  assertViewIsNotAttachedToWindow(preview.view, targetWindow);

  targetWindow.setBrowserView(preview.view);
  preview.view.webContents.focus();

  preview.position = initialPosition;

  updatePreviewSize(preview);

  function handleWindowResize() {
    updatePreviewSize(preview);
  }

  /**
   * Note!: we're handling resizing electron-size, this provides way smoother experience.
   * We can do that because instead of exact size, we keep 'requested distance to each edge of the window'.
   * In a way this is equal information in this context, as each can be derived from other, but with 2nd one we can do everything
   * electron side.
   */
  targetWindow.on("resize", handleWindowResize);

  return function detach() {
    log("will detach view");

    targetWindow.removeBrowserView(preview.view);

    targetWindow.off("resize", handleWindowResize);

    stopRequestingPreload();

    return true;
  };
}

function destroyBrowserView(view: BrowserView) {
  // As of this writing destroy() is an undocumented method for getting rid of a BrowserView.
  // https://github.com/electron/electron/issues/10096#issuecomment-882837830
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view.webContents as any).destroy();
}

function updatePreviewSize(preview: AlivePreviewState) {
  // Should never happen - indicates that we try to update view size before attaching it to window.
  assert(preview.position, "Trying to update preview size before it was rendered");

  // Get desired distance to all the edges. Then get window size and calculate needed size rect.
  const { top, right, bottom, left } = preview.position;

  const [windowWidth, windowHeight] = preview.window.getSize();

  const electronRect = {
    x: left,
    y: top,
    width: windowWidth - left - right,
    height: windowHeight - top - bottom,
  };

  preview.view.setBounds(electronRect);
}

function assertViewIsNotAttachedToWindow(view: BrowserView, window: BrowserWindow) {
  assert(!window.getBrowserViews().includes(view), "Requested view is already attached to the window");
}

export function initPreviewHandler() {
  requestPreviewPreload.handle(async ({ url }, event) => {
    assert(event, "Preload can only be requested from client side");

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view");

    const [, stopRequesting] = await requestPreviewLoad(url, targetWindow);

    return stopRequesting;
  });

  requestAttachPreview.handle(async ({ url, position }, event) => {
    assert(event, "Show browser view can only be called from client side");

    const targetWindow = getSourceWindowFromIPCEvent(event);
    assert(targetWindow, "No target window for showing browser view");

    log("will attach view", { url, position });

    return attachPreviewToWindow(url, position, targetWindow);
  });

  updatePreviewPosition.handle(async ({ position, url }) => {
    const viewRef = alivePreviews.get(url);

    if (!viewRef) return;

    log("updating preview position requirements", position);

    viewRef.position = position;

    updatePreviewSize(viewRef);
  });
}
