import { focusOverlayWindowRequest } from "@aca/desktop/bridge/windows";
import { createChangeCallback } from "@aca/shared/changeCallback";
import { createCleanupObject } from "@aca/shared/cleanup";
import { autorunEffect } from "@aca/shared/mobx/utils";
import { BrowserWindow, app } from "electron";

import { appState } from "../appState";
import { NewWindowHandler } from "./newWindowHandler";
import { mirrorWindowBounds } from "./utils/follow";
import { manageMouseEventsInOverlayWindow } from "./utils/mouseEventsManager";

/**
 * We're creating invisible window as a host for child windows.
 *
 * Perfect would be to just use main window. It however, always focuses main window when
 * child is closed. It is often not what we want.
 *
 * I tried to find a way to 'remember previously focused app' and restore it, but was not able to.
 */

let registeredOverlayWindow: BrowserWindow;

export const overlayWindowHandler: NewWindowHandler = {
  overrides: {
    // title: "",

    webPreferences: {
      // contextIsolation: true,
      // backgroundThrottling: false,
      // backgroundThrottling: false,
    },
    // transparent: true,
    title: "",
    //
    hasShadow: false,
    focusable: true,
    alwaysOnTop: true,
    transparent: true,
    acceptFirstMouse: true,

    // frame: false,
    titleBarStyle: "hiddenInset",

    width: 900,
    height: 680,

    fullscreenable: true,
    trafficLightPosition: { x: 19, y: 18 },
  },
  initializer(overlayWindow) {
    registeredOverlayWindow = overlayWindow;
    console.log("Overlay initialize");
    return autorunEffect(() => {
      const { mainWindow } = appState;

      if (!mainWindow) return;

      /**
       * https://www.electronjs.org/docs/latest/api/browser-window#platform-notices
       *
       * On macOS, setting parent window will automatically make child window follow its position.
       * but not on win / linux.
       *
       * As a fallback we do 'on bounds change' > 'sync bounds'
       *
       * It works just fine, but has noticable delay then.
       */
      // overlayWindow.setParentWindow(mainWindow);
      // overlayWindow.setAlwaysOnTop(true, "floating");
      const cleanup = createCleanupObject();

      // overlayWindow.webContents.openDevTools({ mode: "detach" });

      cleanup.next = mirrorWindowBounds(mainWindow, overlayWindow);
      cleanup.next = manageMouseEventsInOverlayWindow(overlayWindow, mainWindow);
      cleanup.next = showWindowOnlyWhenParentFocused(mainWindow, overlayWindow);

      return cleanup.clean;
    });
  },
};

function showWindowOnlyWhenParentFocused(parent: BrowserWindow, target: BrowserWindow) {
  const updateParentFocus = createChangeCallback((parentHasFocus: boolean) => {
    target.setAlwaysOnTop(parentHasFocus);
    if (parentHasFocus) {
      target.setTrafficLightPosition({ x: 5019, y: 18 });
    } else {
      target.setTrafficLightPosition({ x: 19, y: 18 });
    }
  });

  //
  function update() {
    if (parent.isFocused()) {
      updateParentFocus(true);
    } else {
      updateParentFocus(false);
    }
  }

  parent.on("focus", update);
  parent.on("blur", update);

  return () => {
    parent.off("focus", update);
    parent.off("blur", update);
  };
}

export function handleOverlayWindowFocusing() {
  focusOverlayWindowRequest.handle(async () => {
    registeredOverlayWindow?.focus();
  });
}
