import { BrowserView, BrowserWindow } from "electron";

import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";
import { makeLinksOpenInDefaultBrowser } from "@aca/desktop/electron/utils/openLinks";
import { createCleanupObject } from "@aca/shared/cleanup";
import { SECOND } from "@aca/shared/time";

import { loadPreviewIfNeeded } from "./load";
import { attachViewToPreloadingWindow } from "./preloadingWindow";
import { listenForViewKeyboardBlurRequest } from "./utils/keyboardBlur";
import { memoizeWithCleanup } from "./utils/memoizeWithCleanup";
import { autoMuteBlurredBrowserView } from "./utils/muteBlurred";
import { publishBrowserViewEvents } from "./utils/publishBrowserViewEvents";
import { getBrowserViewParentWindow } from "./utils/view";

const log = makeLogger("Preview Manager");

function createPreviewBrowserView(url: string) {
  log(`Creating preview manager ${url}`);
  const browserView = new BrowserView({
    webPreferences: { preload: undefined },
  });

  const cleanups = createCleanupObject();

  attachViewToPreloadingWindow(browserView);

  cleanups.next = makeLinksOpenInDefaultBrowser(browserView.webContents);
  cleanups.next = publishBrowserViewEvents(url, browserView);
  cleanups.next = autoMuteBlurredBrowserView(browserView);
  cleanups.next = listenForViewKeyboardBlurRequest(browserView.webContents, () => {
    getBrowserViewParentWindow(browserView)?.webContents.focus();
  });

  browserView.webContents.once("destroyed", cleanups.clean);

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
