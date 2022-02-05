import { BrowserView, BrowserWindow, app, session } from "electron";
import { isEqual } from "lodash";
import { memoize } from "lodash";

import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { PreviewPosition } from "@aca/desktop/domains/preview";
import { assert } from "@aca/shared/assert";
import { createChannel } from "@aca/shared/channel";
import { createResolvablePromise } from "@aca/shared/promises";
import { wait } from "@aca/shared/time";

import { appState } from "../../appState";
import { evaluateFunctionInWebContents, listenToWebContentsFocus } from "../../utils/webContentsLink";
import { PreviewAttachManager, attachBrowserViewToWindow } from "./previewAttaching";
import { loadURLWithFilters } from "./siteFilters";

const dummyWindow = memoize(() => {
  const window = new BrowserWindow({ opacity: 0, transparent: true, focusable: true });
  window.setIgnoreMouseEvents(true);

  return window;
});

function getViewHostWindow(view: BrowserView) {
  const allWindows = BrowserWindow.getAllWindows();
  return (
    allWindows.find((window) => {
      if (window === dummyWindow()) return false;
      return window.getBrowserViews().includes(view);
    }) ?? null
  );
}

app.whenReady().then(() => {
  return;
  session.defaultSession.setCertificateVerifyProc((proc, cb) => {
    cb(0);
  });
});

export function createPreviewManager(url: string) {
  const browserView = new BrowserView({ webPreferences: { preload: "" } });
  const preloadingWindow = dummyWindow();

  browserView.webContents.session.preconnect({ url });

  let currentWindowAttachment: PreviewAttachManager | null = null;

  preloadingWindow.addBrowserView(browserView);
  // getTargetWindow().addBrowserView(browserView);

  // browserView.setBounds({ height: 100, width: 100, x: 100, y: 100 });

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
      const windowToRestoreFocus = getCurrentlyFocusedWindow();
      // browserView.webContents.focus();
      // await wait(10);
      // windowToRestoreFocus?.focus();
      await loadURLWithFilters(browserView, url);
      browserView.webContents.focus();
      // await wait(200);

      if (isDestroyed) return;

      await evaluateFunctionInWebContents(browserView.webContents, () => {
        window.focus();
        // window.document.body.click();
      });

      // browserView.webContents.focus();
      // await wait(10);
      windowToRestoreFocus?.focus();
      getCurrentlyFocusedWindow()?.focus();
    } catch (error) {
      //
    }

    if (isDestroyed) return;

    loadingPromise.resolve();

    if (currentWindowAttachment) return;
    // probablyMainWindow.setBrowserView(browserView);
    // if (!currentWindowAttachment) {
    //   probablyMainWindow.setBrowserView(browserView);
    //   await wait(200);
    //   probablyMainWindow.removeBrowserView(browserView);
    // }
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

    console.log("DETACHING");
    //
    currentWindowAttachment.detach();

    currentWindowAttachment = null;
  }

  //

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

  //
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

function getCurrentlyFocusedWindow() {
  //
  return (
    BrowserWindow.getAllWindows().find((window) => {
      return window.isFocused();
    }) ??
    appState.mainWindow ??
    BrowserWindow.getAllWindows()[0]
  );
}
