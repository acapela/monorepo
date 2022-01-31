import { BrowserWindow, IpcMainInvokeEvent } from "electron";

/**
 * Will return window that did send given message
 */
export function getSourceWindowFromIPCEvent(event: IpcMainInvokeEvent) {
  const windowId = event?.frameId;

  if (!windowId) return null;

  const senderWindow = BrowserWindow.fromId(windowId);

  if (!senderWindow) return null;

  return senderWindow;
}
