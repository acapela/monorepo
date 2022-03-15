import { BrowserView } from "electron";
import createContextMenu from "electron-context-menu";

import { previewEventsBridge } from "@aca/desktop/bridge/preview";

import { getBrowserViewParentWindow } from "./view";

export function createDefaultContextMenu(url: string, view: BrowserView) {
  const remove = createContextMenu({
    window: view.webContents,
    showInspectElement: false,
    append: () => {
      return [
        {
          label: "Resolve notification",
          click: () => {
            previewEventsBridge.send({ url, type: "resolve-request" });
          },
        },
        {
          label: "Snooze...",
          click: () => {
            previewEventsBridge.send({ url, type: "snooze-request" });
          },
        },
        { type: "separator" },
        {
          label: "Open in default app",
          click: () => {
            previewEventsBridge.send({ url, type: "open-in-app-request" });
          },
        },
        {
          label: "Scroll to target...",
          enabled: false,
        },
        {
          label: "Focus back Acapela App",
          click: () => {
            getBrowserViewParentWindow(view)?.webContents?.focus();
          },
        },
      ];
    },
  });

  return remove;
}
