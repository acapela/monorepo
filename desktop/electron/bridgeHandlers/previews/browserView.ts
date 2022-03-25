import { BrowserView, BrowserWindow, WebContents } from "electron";

import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { makeLinksOpenInDefaultBrowser } from "@aca/desktop/electron/windows/utils/openLinks";
import { createCleanupObject } from "@aca/shared/cleanup";
import { SECOND } from "@aca/shared/time";
import { MaybeCleanup } from "@aca/shared/types";

import { listenToWebContentsFocus } from "../../utils/webContentsLink";
import { focusWindowWebContents } from "../../windows/focusWindow";
import { getBrowserViewParentWindow } from "../../windows/viewUtils";
import { setBrowserViewZIndex } from "../../windows/viewZIndex";
import { loadPreviewIfNeeded } from "./load";
import { attachViewToPreloadingWindow } from "./preloadingWindow";
import { createDefaultContextMenu } from "./utils/contextMenu";
import { listenForViewKeyboardBlurRequest } from "./utils/keyboardBlur";
import { memoizeWithCleanup } from "./utils/memoizeWithCleanup";
import { autoMuteBlurredBrowserView } from "./utils/muteBlurred";
import { publishBrowserViewEvents } from "./utils/publishBrowserViewEvents";

const log = makeLogger("Preview Manager");

export function reinitializeOnNavigation(web: WebContents, callback: (web: WebContents) => MaybeCleanup) {
  let currentCleanup = callback(web);

  web.on("did-navigate", () => {
    currentCleanup?.();
    currentCleanup = callback(web);
  });

  const clean = () => {
    currentCleanup?.();
  };

  return clean;
}

function createPreviewBrowserView(url: string) {
  log(`Creating preview manager ${url}`);
  const browserView = new BrowserView({
    webPreferences: { preload: undefined },
  });

  attachViewToPreloadingWindow(browserView);

  const cleanup = reinitializeOnNavigation(browserView.webContents, () => {
    const cleanups = createCleanupObject();
    cleanups.next = makeLinksOpenInDefaultBrowser(browserView.webContents);
    cleanups.next = publishBrowserViewEvents(url, browserView);
    cleanups.next = autoMuteBlurredBrowserView(browserView);
    cleanups.next = listenForViewKeyboardBlurRequest(browserView.webContents, () => {
      const parentWindow = getBrowserViewParentWindow(browserView);

      if (parentWindow) {
        focusWindowWebContents(parentWindow);
      }
    });

    cleanups.next = listenToWebContentsFocus(browserView.webContents, (isFocused) => {
      if (!isFocused) return;

      setBrowserViewZIndex(browserView, isFocused ? "aboveApp" : "belowApp");
    });

    cleanups.next = createDefaultContextMenu(url, browserView);

    return () => {
      cleanups.clean();
    };
  });

  browserView.webContents.once("destroyed", cleanup);

  loadPreviewIfNeeded(browserView, url);

  return browserView;
}

export function destroyBrowserView(view: BrowserView) {
  view.webContents.stop();

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

export const requestPreviewBrowserView = memoizeWithCleanup(
  (url: string) => {
    return createPreviewBrowserView(url);
  },
  {
    keyGetter: (url) => url,
    cleanup(view, url) {
      preloadingNotificationsBridgeChannel.update((stateMap) => {
        delete stateMap[url];
      });

      destroyBrowserView(view);
    },
    destroyTimeout: SECOND * 0.5,
  }
);
