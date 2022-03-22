import { BrowserView, BrowserWindow } from "electron";

// function makeBrowserViewOccupyEntireArea(window: BrowserWindow, view: BrowserView) {}

export function handleMainViewPosition(window: BrowserWindow, view: BrowserView) {
  function update() {
    const { height, width } = window.getBounds();

    view.setBounds({ height, width, x: 0, y: 0 });
  }

  update();

  window.on("resize", update);

  return () => {
    window.off("resize", update);
  };
}
