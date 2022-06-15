import { BrowserWindow, Display, Rectangle, screen } from "electron";

import { createLazyChangeCallback } from "@aca/shared/callbacks/lazyChangeCallback";
import { createCleanupObject } from "@aca/shared/cleanup";
import { createInterval } from "@aca/shared/time";

import { ChildWindowHandler } from "./types";

/**
 * Will allow our widget to be on top of fullscreen apps
 * https://github.com/electron/electron/issues/10078#issuecomment-331581160
 */
function handleInitialFlags(window: BrowserWindow) {
  window.setAlwaysOnTop(true, "floating");
  window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  window.setFullScreenable(false);
}

export const focusBarWindowHandler: ChildWindowHandler = {
  initializer(window, hostWindow) {
    handleInitialFlags(hostWindow);
    handleInitialFlags(window);
    return handlePositioning(window, hostWindow);
  },
  options: {
    alwaysOnTop: true,
    frame: false,
    kiosk: false,
    title: "",
    skipTaskbar: true,
    vibrancy: "hud",
    visualEffectState: "active",
    enableLargerThanScreen: true,
  },
};

function getBottomCenterBoundsInDisplay(window: BrowserWindow, display: Display): Rectangle {
  /**
   * If user uses multiple displays - x, y of display will tell its position (can be negative if eg. user has display on left of primary display)
   */
  const { height: displayHeight, width: displayWidth, x: displayX, y: displayY } = display.bounds;
  const { width: windowWidth, height: windowHeight } = window.getBounds();

  const newBounds: Rectangle = {
    y: displayY + displayHeight - BOTTOM_DISTANCE - windowHeight,
    x: displayX + (displayWidth - windowWidth) / 2,
    width: windowWidth,
    height: windowHeight,
  };

  return newBounds;
}

function findDisplayWithCursorInside() {
  const cursorPoint = screen.getCursorScreenPoint();

  return screen.getDisplayNearestPoint(cursorPoint);
}

const BOTTOM_DISTANCE = 80;

function positionWindowOnBottomCenterOfDisplay(display: Display, window: BrowserWindow, hostWindow: BrowserWindow) {
  const bounds = getBottomCenterBoundsInDisplay(window, display);

  hostWindow.setBounds(bounds);
  window.setBounds(bounds);
}

function getDisplayById(id: number) {
  return screen.getAllDisplays().find((display) => display.id === id);
}

function handlePositioning(window: BrowserWindow, hostWindow: BrowserWindow) {
  /**
   * We'll auto-position window on bottom-center of display where mouse is, but only as long as user does not manually move the window.
   * Then we fully stop the process.
   *
   * Note: I'm not sure if it is good UX. I first implemented alternative where we remember manual user position per display, but still make widget follow cursor (so each display could have different position of widget)
   *
   * But in the end I tought it'd still be annoying if you don't want it to follow you. As we show widget even on top of fullscreen apps - it should be relatively easy for user to drag it anywhere if needed.
   */
  let whoIsMovingWindow: "user" | "system" = "user";

  const cleanup = createCleanupObject();

  function autoPosition() {
    try {
      whoIsMovingWindow = "system";
      const focusedDisplay = findDisplayWithCursorInside();

      positionOnDisplayIfNeeded(focusedDisplay.id);
    } finally {
      whoIsMovingWindow = "user";
    }
  }

  const positionOnDisplayIfNeeded = createLazyChangeCallback((displayId: number) => {
    const display = getDisplayById(displayId);

    if (!display) return;

    positionWindowOnBottomCenterOfDisplay(display, window, hostWindow);
  });

  autoPosition();

  cleanup.next = createInterval(() => {
    // We cannot attach 'mouse moved' events (there is iohook lib, but it requires permissions), but we can get mouse position at any time.
    // As it seems to be cheap - let's track it frequently to avoid delay when cursor moved between displays
    autoPosition();
  }, 250);

  function handleWindowMoved() {
    if (whoIsMovingWindow === "system") {
      return;
    }

    // Window was moved manually by user, skip moving
    cleanup.clean();
  }

  window.addListener("moved", handleWindowMoved);

  cleanup.next = () => {
    window.removeListener("moved", handleWindowMoved);
  };

  return cleanup.clean;
}
