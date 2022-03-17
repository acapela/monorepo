import { BrowserWindow } from "electron";

export function mirrorWindowBounds(sourceToFollow: BrowserWindow, followingWindow: BrowserWindow) {
  function sync() {
    const bounds = sourceToFollow.getBounds();

    followingWindow.setBounds(bounds);
  }

  sync();

  sourceToFollow.on("resize", sync);
  sourceToFollow.on("move", sync);
  sourceToFollow.on("will-move", sync);

  return () => {
    sourceToFollow.off("resize", sync);
    sourceToFollow.off("move", sync);
    sourceToFollow.off("will-move", sync);
  };
}
