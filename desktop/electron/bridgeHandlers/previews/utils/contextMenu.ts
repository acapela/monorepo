import { BrowserView } from "electron";
import createContextMenu from "electron-context-menu";

import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { focusMainView } from "@aca/desktop/electron/windows/mainWindow";

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
          label: "Add reminder...",
          click: () => {
            focusMainView();
            previewEventsBridge.send({ url, type: "add-reminder-request" });
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
            focusMainView();
          },
        },
      ];
    },
  });

  return remove;
}
