import { BrowserWindow, IpcMainInvokeEvent } from "electron";

/**
 * Will return window that did send given message
 */
export function getSourceWindowFromIPCEvent(event: IpcMainInvokeEvent) {
  if (!event) return null;

  let senderWindow = BrowserWindow.fromId(event.frameId);

  if (senderWindow) {
    return senderWindow;
  }

  senderWindow = BrowserWindow.getAllWindows().find((window) => window.webContents === event.sender) ?? null;

  if (senderWindow) {
    return senderWindow;
  }

  console.warn(`Failed to get window from ipc event`);

  return null;
}
