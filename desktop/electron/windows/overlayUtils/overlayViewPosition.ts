import { BrowserView, BrowserWindow } from "electron";

import { toastsHeightChangeBridgeChannel } from "@aca/desktop/bridge/toasts";

// function makeBrowserViewOccupyEntireArea(window: BrowserWindow, view: BrowserView) {}

const OVERLAY_WIDTH = 360;
const OVERLAY_EDGE_OFFSET = 0;

export function handleOverlayViewPosition(browserWindow: BrowserWindow, view: BrowserView) {
  let overlayHeight = 0;

  async function update() {
    const { height, width } = browserWindow.getBounds();

    const x = width - OVERLAY_WIDTH - OVERLAY_EDGE_OFFSET;
    const y = height - overlayHeight - OVERLAY_EDGE_OFFSET;

    view.setBounds({ height: overlayHeight, width: OVERLAY_WIDTH, x, y });
  }

  toastsHeightChangeBridgeChannel.subscribe((newHeight) => {
    overlayHeight = Math.round(newHeight);
    update();
  });

  update();

  browserWindow.on("resize", update);

  return () => {
    browserWindow.off("resize", update);
  };
}
