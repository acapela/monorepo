import { BrowserView } from "electron";
import { mapValues } from "lodash";

import {
  hideBrowserView,
  registerBrowserViewPreload,
  showBrowserView,
  unregisterBrowserViewPreload,
} from "@aca/desktop/bridge/preview";
import { appState } from "@aca/desktop/electron/appState";
import { assert, assertDefined } from "@aca/shared/assert";

import { loadURLWithFilters } from "./siteFilters";

const DESTROY_BROWSER_VIEW_TIMEOUT_MS = 5000;

type StringURL = string;
const browserViewRefs: Record<
  StringURL,
  {
    view: BrowserView;
    subscribers: Set<string>;
    destroyTimeout: null | ReturnType<typeof setTimeout>;
  }
> = {};

async function registerBrowserViewSubscriber(url: string, id: string) {
  const { mainWindow } = appState;
  assert(mainWindow, "mainWindow is not defined");

  let ref = browserViewRefs[url];
  if (ref) {
    if (ref.destroyTimeout) {
      console.info("cancelling browser view destroy timeout for", url);
      clearTimeout(ref.destroyTimeout);
      ref.destroyTimeout = null;
    }
    ref.subscribers.add(id);
  } else {
    const browserView = new BrowserView();
    browserView.setBounds(mainWindow.getBounds());
    ref = browserViewRefs[url] = {
      view: browserView,
      subscribers: new Set([id]),
      destroyTimeout: null,
    };

    await loadURLWithFilters(browserView, url);
  }

  return ref.view;
}

function unregisterBrowserViewSubscriber(url: string, id: string) {
  const ref = assertDefined(browserViewRefs[url], `browserViewRef is missing for: ${url}`);
  const wasPresent = ref.subscribers.delete(id);
  if (!wasPresent) {
    // eslint-disable-next-line no-console
    console.trace("no subscribers found for url", url, "with id", id);
  } else if (ref.subscribers.size == 0 && !ref.destroyTimeout) {
    console.info("starting browser view destroy timeout for", url);
    ref.destroyTimeout = setTimeout(() => {
      console.info("destroying browser view for", url);
      // As of this writing destroy() is an undocumented method for getting rid of a BrowserView.
      // https://github.com/electron/electron/issues/10096#issuecomment-882837830
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (browserViewRefs[url].view.webContents as any).destroy();
      delete browserViewRefs[url];
    }, DESTROY_BROWSER_VIEW_TIMEOUT_MS);
  }
}

export function initPreviewHandler() {
  registerBrowserViewPreload.handle(async ({ url, id }) => {
    await registerBrowserViewSubscriber(url, id);
    return true;
  });

  unregisterBrowserViewPreload.handle(async ({ url, id }) => {
    unregisterBrowserViewSubscriber(url, id);
    return true;
  });

  showBrowserView.handle(async ({ url, id, bounds }) => {
    const { mainWindow } = appState;
    assert(mainWindow, "mainWindow is not defined");

    const browserView = await registerBrowserViewSubscriber(url, id);
    mainWindow.setBrowserView(browserView);

    const roundedBounds = mapValues(bounds, (value) => Math.round(value));
    for (const { view } of Object.values(browserViewRefs)) {
      // We'll update bounds for all BrowserViews here to make them the correct size for immediate display
      view.setBounds(roundedBounds);
    }

    return true;
  });

  hideBrowserView.handle(async ({ url, id }) => {
    const browserView = browserViewRefs[url]?.view;
    if (browserView) {
      const { mainWindow } = appState;
      assert(mainWindow, "mainWindow is not defined");
      mainWindow.removeBrowserView(browserView);
    }

    unregisterBrowserViewSubscriber(url, id);

    return true;
  });
}
