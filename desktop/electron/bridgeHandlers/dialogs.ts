import { dialog } from "electron";

import { showConfirmDialogRequest } from "@aca/desktop/bridge/dialogs";

import { getSourceWindowFromIPCEvent } from "../utils/ipc";

export function initializeDialogsHandlers() {
  showConfirmDialogRequest.handle(
    async ({ message, detail, confirmLabel = "Confirm", cancelLabel = "Cancel" }, event) => {
      if (!event) return false;
      const window = getSourceWindowFromIPCEvent(event);

      if (!window) return false;

      const { response } = await dialog.showMessageBox(window, {
        message,
        type: "info",
        detail,
        buttons: [confirmLabel, cancelLabel],
        cancelId: 1,
        defaultId: 0,
      });

      if (response === 0) {
        return true;
      }

      return false;
    }
  );
}
