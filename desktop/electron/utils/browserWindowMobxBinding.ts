import { BrowserWindow } from "electron";
import { memoize } from "lodash";
import { observable } from "mobx";

export const createBrowserWindowMobxBinding = memoize(function createBrowserWindowMobxBinding(window: BrowserWindow) {
  const isFocused = observable.box(window.isFocused());
  const isFullscreen = observable.box(window.isFullScreen());
  const bounds = observable.box(window.getBounds());
  const liveBounds = observable.box(window.getBounds());

  window.on("enter-full-screen", () => isFullscreen.set(true));
  window.on("leave-full-screen", () => isFullscreen.set(false));

  function updateBounds() {
    bounds.set(window.getBounds());
  }

  function updateLiveBounds() {
    liveBounds.set(window.getBounds());
  }

  window.on("focus", () => isFocused.set(true));
  window.on("blur", () => isFocused.set(false));
  window.on("resized", updateBounds);
  window.on("moved", updateBounds);
  window.on("resize", updateLiveBounds);
  window.on("move", updateLiveBounds);

  return {
    get bounds() {
      return bounds.get();
    },
    get isFocused() {
      return isFocused.get();
    },
    get isFullscreen() {
      return isFullscreen.get();
    },
  };
});
