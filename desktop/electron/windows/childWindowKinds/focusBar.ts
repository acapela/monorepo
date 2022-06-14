import { BrowserWindow, Rectangle, screen } from "electron";

import { ChildWindowHandler } from "./types";

export const focusBarWindowHandler: ChildWindowHandler = {
  initializer(window) {
    handlePositioning(window);
  },
  options: {
    alwaysOnTop: true,
    frame: false,
    // focusable: false,
    kiosk: false,
    title: "",
    skipTaskbar: true,
    vibrancy: "hud",
    visualEffectState: "active",
  },
};

function findDisplayWithCursorInside() {
  const cursorPoint = screen.getCursorScreenPoint();

  return screen.getDisplayNearestPoint(cursorPoint);
}

const BOTTOM_DISTANCE = 80;

function putWindowOnBottomOfActiveDisplay(window: BrowserWindow) {
  const focusedDisplay = findDisplayWithCursorInside();

  const { height: displayHeight, width: displayWidth } = focusedDisplay.bounds;
  const { width: windowWidth, height: windowHeight } = window.getBounds();

  const newBounds: Partial<Rectangle> = {
    y: displayHeight - BOTTOM_DISTANCE - windowHeight,
    x: (displayWidth - windowWidth) / 2,
    width: windowWidth,
    height: windowHeight,
  };

  window.setBounds(newBounds);
}

function handlePositioning(window: BrowserWindow) {
  putWindowOnBottomOfActiveDisplay(window);
}
