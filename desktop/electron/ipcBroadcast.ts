import { ipcMain, webContents } from "electron";

interface BroadcastRequestData {
  channel: string;
  data: unknown;
}

export function initializeIpcBroadcast() {
  ipcMain.on("broadcast-request", (event, { channel, data }: BroadcastRequestData) => {
    const sendingWebContents = event.sender;
    webContents.getAllWebContents().forEach((existingWebContents) => {
      if (existingWebContents === sendingWebContents) return;

      existingWebContents.send(channel, data);
    });
  });
}
