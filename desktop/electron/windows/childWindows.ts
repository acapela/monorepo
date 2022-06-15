import { BrowserWindow, WebContents, app } from "electron";

import { ChildWindowCustomKind } from "@aca/desktop/domains/childWindow/kinds";
import { createCleanupObject } from "@aca/shared/cleanup";
import { removePrefix } from "@aca/shared/text/substring";

import { childWindowKindHandlers } from "./childWindowKinds/handlers";
import { ChildWindowHandler } from "./childWindowKinds/types";

/**
 * We're creating invisible window as a host for child windows.
 *
 * Perfect would be to just use main window. It however, always focuses main window when
 * child is closed. It is often not what we want.
 *
 * I tried to find a way to 'remember previously focused app' and restore it, but was not able to.
 */
const createChildWindowHost = (handler: ChildWindowHandler | null) => {
  const hostWindow = new BrowserWindow({
    width: 900,
    height: 680,
    opacity: 0,
    title: "",
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
    },
    minWidth: 900,
    minHeight: 680,
    fullscreenable: true,
  });

  hostWindow.setIgnoreMouseEvents(true);

  const cleanup = createCleanupObject();

  app.on("browser-window-created", (_, childWindow) => {
    if (childWindow.getParentWindow() !== hostWindow) return;

    cleanup.next = handler?.initializer?.(childWindow, hostWindow);

    childWindow.once("close", () => {
      cleanup.clean();
      hostWindow.close();
    });
  });

  return hostWindow;
};

function pickWindowKindFromFeatures(features: string): ChildWindowCustomKind | null {
  const segments = features.split(",");

  for (const segment of segments) {
    if (!segment.startsWith("kind=")) continue;

    return removePrefix(segment, "kind=") as ChildWindowCustomKind;
  }

  return null;
}

export function initializeChildWindowHandlers(webContents: WebContents) {
  webContents.setWindowOpenHandler(({ url, features }) => {
    if (url !== "about:blank") {
      return { action: "deny" };
    }

    const kind = pickWindowKindFromFeatures(features);

    const customHandler = kind ? childWindowKindHandlers[kind] : null;

    const host = createChildWindowHost(customHandler);

    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        paintWhenInitiallyHidden: true,
        parent: host,
        ...customHandler?.options,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          backgroundThrottling: false,
        },
      },
    };
  });
}
