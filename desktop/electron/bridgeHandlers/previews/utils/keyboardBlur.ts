import { WebContents } from "electron";
import { isEqual } from "lodash";

import { evaluateFunctionInWebContents } from "@aca/desktop/electron/utils/webContentsLink";

export function listenForViewKeyboardBlurRequest(webContents: WebContents, callback: () => void) {
  async function handleBeforeInput(event: Electron.Event, input: Electron.Input) {
    // Handle Esc press only
    if (input.type !== "keyDown" || input.key !== "Escape") return;

    // If it is CMD + Esc - restore focus to main window instantly
    if (isEqual(input.modifiers, ["meta"])) {
      callback();
      return;
    }

    // Check if there is any editable element focused (aka cursor blinking anywhere).
    const isAnyInputFocused = await evaluateFunctionInWebContents(webContents, () => {
      return document.activeElement !== document.body;
    });

    // if something is focused, blur it, but don't escape preview focus yet.
    if (isAnyInputFocused) {
      await evaluateFunctionInWebContents(webContents, () => {
        return (document.activeElement as HTMLElement)?.blur();
      });
      return;
    }

    // Esc was pressed without any editable element focused, restore focus to main window

    callback();
  }

  webContents.on("before-input-event", handleBeforeInput);

  return () => {
    webContents.off("before-input-event", handleBeforeInput);
  };
}
