import { IpcMainEvent, ipcMain } from "electron";

import { ElectronChannelSubscriber } from "@aca/desktop/bridge/base";

/**
 * Important note.
 *
 * We pass ipcMain to global on electron side to be able use it in files that are imported both by electron and client.
 * This is used in `bridge/base`, under proper abstraction.
 *
 * This should not be used directly in other places. If some file is imported only by electron side -
 * simply `import { ipcMain } from 'electron'`
 */
const electronGlobal = {
  ipcMain: ipcMain,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscribe: (channel: string, subscriber: ElectronChannelSubscriber<any>) => {
    function handler(event: IpcMainEvent, data: unknown) {
      subscriber(data, {
        reply(data: unknown) {
          event.reply(channel, data);
        },
      });
    }
    ipcMain.on(channel, handler);

    return function cancel() {
      ipcMain.off(channel, handler);
    };
  },
};

type ElectronGlobal = typeof electronGlobal;

declare global {
  // eslint-disable-next-line no-var
  var electronGlobal: ElectronGlobal;
}

export {};

global.electronGlobal = electronGlobal;
