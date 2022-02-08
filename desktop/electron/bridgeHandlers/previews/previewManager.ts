import { BrowserView, BrowserWindow } from "electron";
import { isEqual } from "lodash";

import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { PreviewPosition } from "@aca/desktop/domains/preview";
import { assert } from "@aca/shared/assert";
import { createChannel } from "@aca/shared/channel";
import { createResolvablePromise } from "@aca/shared/promises";

import { evaluateFunctionInWebContents, listenToWebContentsFocus } from "../../utils/webContentsLink";
import { attachViewToPreloadingWindow, getPreloadingWindow } from "./preloadingWindow";
import { PreviewAttachManager, attachBrowserViewToWindow } from "./previewAttaching";
import { loadURLWithFilters } from "./siteFilters";

function getViewHostWindow(view: BrowserView) {
  const allWindows = BrowserWindow.getAllWindows();
  return (
    allWindows.find((window) => {
      if (window === getPreloadingWindow()) return false;
      return window.getBrowserViews().includes(view);
    }) ?? null
  );
}

export function createPreviewManager(url: string) {
  const browserView = new BrowserView({ webPreferences: { preload: "" } });
  const preloadingWindow = getPreloadingWindow();

  browserView.webContents.session.preconnect({ url });

  let currentWindowAttachment: PreviewAttachManager | null = null;

  attachViewToPreloadingWindow(browserView);

  browserView.webContents.setAudioMuted(true);

  const onFocusChange = createChannel<boolean>();
  const onBlurRequest = createChannel();

  onBlurRequest.subscribe(() => {
    getViewHostWindow(browserView)?.webContents.focus();
  });

  onFocusChange.subscribe((isFocused) => {
    previewEventsBridge.send({ url, type: isFocused ? "focus" : "blur" });
  });

  browserView.webContents.on("before-input-event", async (event, input) => {
    // Handle Esc press only
    if (input.type !== "keyDown" || input.key !== "Escape") return;

    input.modifiers;

    // If it is CMD + Esc - restore focus to main window instantly
    if (isEqual(input.modifiers, ["meta"])) {
      onBlurRequest.publish();
      return;
    }

    // Check if there is any editable element focused (aka cursor blinking anywhere).
    const isAnyInputFocused = await evaluateFunctionInWebContents(browserView.webContents, () => {
      return document.activeElement !== document.body;
    });

    // if something is focused, blur it, but don't escape preview focus yet.
    if (isAnyInputFocused) {
      await evaluateFunctionInWebContents(browserView.webContents, () => {
        return (document.activeElement as HTMLElement)?.blur();
      });
      return;
    }

    // Esc was pressed without any editable element focused, restore focus to main window

    onBlurRequest.publish();
  });

  listenToWebContentsFocus(browserView.webContents, (isFocused) => {
    browserView.webContents.setAudioMuted(!isFocused);
    onFocusChange.publish(isFocused);
  });

  const loadingPromise = createResolvablePromise();

  const preload = async function preload() {
    assertNotDestroyed("Preloading destroyed");
    if (browserView.webContents.isLoading()) return;

    try {
      await loadURLWithFilters(browserView, url);
    } catch (error) {
      //
    }

    if (isDestroyed) return;

    loadingPromise.resolve();
  };

  let isDestroyed = false;
  function assertNotDestroyed(message = "Expected not destroyed") {
    assert(!isDestroyed, message);
  }
  function destroy() {
    assertNotDestroyed("Already destroyed");
    isDestroyed = true;

    //
    browserView.webContents.stop();
    if (currentWindowAttachment) {
      detach();
    }

    destroyBrowserView(browserView);
  }

  function attachToWindow(window: BrowserWindow, initialPosition: PreviewPosition) {
    preloadingWindow.removeBrowserView(browserView);
    assertNotDestroyed("Already destroyed");
    assert(!currentWindowAttachment, "Attached");
    currentWindowAttachment = attachBrowserViewToWindow(browserView, window, initialPosition);
    return () => {
      detach();
    };
  }

  function detach() {
    assert(currentWindowAttachment, "Not attached");

    currentWindowAttachment.detach();

    currentWindowAttachment = null;
  }

  const manager = {
    url,
    preload,
    destroy,
    loadingPromise,
    get currentWindowAttachment() {
      return currentWindowAttachment;
    },
    attachToWindow,
    detach,
    onFocusChange,
    onBlurRequest,
  };

  return manager;
}

export type PreviewManager = ReturnType<typeof createPreviewManager>;

function destroyBrowserView(view: BrowserView) {
  // https://github.com/electron/electron/issues/10096#issuecomment-320163081
  // If we try to destroy view before un-attaching it from all windows it is present in - app will crash with "SIGSEGV"
  BrowserWindow.getAllWindows().forEach((window) => {
    window.removeBrowserView(view);
  });

  // As of this writing destroy() is an undocumented method for getting rid of a BrowserView.
  // https://github.com/electron/electron/issues/10096#issuecomment-882837830
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (view.webContents as any).destroy();
}
