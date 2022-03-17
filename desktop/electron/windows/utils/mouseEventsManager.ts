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
    (send) => {
      const CLICKABLE_AREA_CLASSNAME = "clickable-area";

      window.addEventListener("mousemove", (event) => {
        console.log("move");
        const target = event.target as HTMLElement;

        if (target.matches?.(".clickable-area")) {
          send(true);
          return;
        } else {
          send(false);
          return;
        }

        send(false);
        // alert("OK");
        console.log(event);
      });
    },
    (willHandle) => {
      shouldHandleClicks.set(willHandle);
    }
  );

  // const stop = runEffectInWebContents<boolean>(
  //   browserWindow.webContents,
  //   (send) => {
  //     const CLICKABLE_AREA_CLASSNAME = "clickable-area";

  //     function handleMouseEnter(event: MouseEvent) {
  //       const target = event.target as HTMLElement;

  //       console.log("enter", { target });

  //       if (!target.matches) return;

  //       if (!target.matches(`.${CLICKABLE_AREA_CLASSNAME}, .${CLICKABLE_AREA_CLASSNAME} *`)) {
  //         return;
  //       }

  //       console.log("Wiilll do true");

  //       send(true);
  //     }

  //     function handleMouseLeave(event: MouseEvent) {
  //       const target = event.target as HTMLElement;

  //       console.log("leave", { target });

  //       if (!target.matches) return;

  //       if (!target.matches(`.${CLICKABLE_AREA_CLASSNAME}`)) {
  //         return;
  //       }

  //       // There is still clickable parent
  //       if (target.matches(`.${CLICKABLE_AREA_CLASSNAME} .${CLICKABLE_AREA_CLASSNAME}`)) {
  //         return;
  //       }

  //       console.log("Wiilll do false");

  //       send(false);
  //     }

  //     const body = document.body;

  //     document.addEventListener("mouseenter", handleMouseEnter, { capture: true });
  //     document.addEventListener("mousemove", handleMouseEnter, { capture: true });
  //     document.addEventListener("mouseleave", handleMouseLeave, { capture: true });

  //     return () => {
  //       document.removeEventListener("mouseenter", handleMouseEnter, { capture: true });
  //       document.removeEventListener("mousemove", handleMouseEnter, { capture: true });
  //       document.removeEventListener("mouseleave", handleMouseLeave, { capture: true });
  //     };
  //   },
  //   (shouldHandleClicks) => {
  //     handleShouldHandleChange(shouldHandleClicks);
  //   }
  // );

  return stop;
}
