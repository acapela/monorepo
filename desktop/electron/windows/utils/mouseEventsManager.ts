import { autorunEffect } from "@aca/shared/mobx/utils";
import { createInterval } from "@aca/shared/time";
import { BrowserWindow, app } from "electron";
import { observable } from "mobx";

import { runEffectInWebContents } from "../../utils/webContentsLink";

export function manageMouseEventsInOverlayWindow(browserWindow: BrowserWindow, sourceWindow: BrowserWindow) {
  browserWindow.setIgnoreMouseEvents(true, { forward: true });

  const shouldHandleClicks = observable.box(false);

  const clear = autorunEffect(() => {
    if (shouldHandleClicks.get()) {
      browserWindow.setIgnoreMouseEvents(false);
      return;
    }

    sourceWindow.webContents.focus();

    browserWindow.setIgnoreMouseEvents(true, { forward: true });

    return createInterval(() => {
      browserWindow.setIgnoreMouseEvents(true, { forward: true });
    }, 100);
  });

  // runEffectInWebContents<void>(
  //   sourceWindow.webContents,
  //   (send) => {
  //     document.addEventListener(
  //       "click",
  //       () => {
  //         send();
  //       },
  //       { capture: true }
  //     );
  //   },
  //   () => {
  //     // browserWindow.blur();
  //     // browserWindow.blurWebView();
  //     browserWindow.setIgnoreMouseEvents(true, { forward: true });
  //   }
  // );

  const stop = runEffectInWebContents<boolean>(
    browserWindow.webContents,
    (sendShouldHandleMouse) => {
      const ignoredElements = [document, document.body, window, document.documentElement];

      let lastShouldHandle: boolean | null = null;

      function handleShouldHandleMouseChange(shouldHandle: boolean) {
        if (shouldHandle === lastShouldHandle) return;
        lastShouldHandle = shouldHandle;
        sendShouldHandleMouse(shouldHandle);
      }

      function handleMouseEvent(event: MouseEvent) {
        const target = event.target as HTMLElement;

        if (ignoredElements.includes(target)) {
          handleShouldHandleMouseChange(false);
        } else {
          handleShouldHandleMouseChange(true);
        }
      }

      function requestMouseHandling() {
        handleShouldHandleMouseChange(true);
      }

      window.addEventListener("focus", requestMouseHandling);

      window.addEventListener("mousemove", handleMouseEvent);
      window.addEventListener("mouseenter", handleMouseEvent);
      window.addEventListener("mouseleave", handleMouseEvent);
    },
    (willHandle) => {
      shouldHandleClicks.set(willHandle);
    }
  );

  return stop;
}
