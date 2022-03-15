import { BrowserWindow } from "electron";

function syncWindowsSizeOnce(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  const [width, height] = sourceWindow.getSize();

  targetWindow.setSize(width, height, false);
}

/**
 * We want preloads window to mirror main window size to avoid 'size change flicker' when re-attaching
 * previews from preloading window to main window
 */
export function mirrorWindowSize(sourceWindow: BrowserWindow, targetWindow: BrowserWindow) {
  function sync() {
    syncWindowsSizeOnce(sourceWindow, targetWindow);
  }

  sync();

  sourceWindow.on("resized", sync);

  return () => {
    sourceWindow.off("resized", sync);
  };
}
