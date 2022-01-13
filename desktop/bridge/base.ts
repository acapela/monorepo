import type { BrowserWindow, IpcMainInvokeEvent } from "electron";

/**
 * Important note!
 *
 * TLDR: Don't import any runtime thing from electron in this file. This file is imported both by electron and client
 *
 * Utils here allows creating type-safe bridge between electron and client.
 * Those are only bridges - meaning they're not implementing any handling of given bridge events.
 *
 *
 */

/**
 * Will create 'request' bridge - promise style requests from client to electron.
 *
 * Each invoke bridge needs to have handler added somewhere in electron to be able to be invoked.
 */
export function createInvokeBridge<Result, Input = void>(key: string) {
  async function invoke(input: Input): Promise<Result> {
    if (process.env.ELECTRON_CONTEXT !== "client") {
      throw new Error(`Invoke can only be called on client side`);
    }

    return window.electronBridge.invoke(key, input);
  }

  /**
   * Function needed to add electron side implementation that can handle given request
   */
  invoke.handle = (handler: (input: Input, event: IpcMainInvokeEvent) => Promise<Result>) => {
    if (process.env.ELECTRON_CONTEXT === "client") {
      throw new Error(`Cannot handle client side`);
    }
    /**
     * Important note - we're not importing `ipcMain` in this file. This file is imported both by client and electron,
     * thus we cannot import any runtime code from electron here.
     *
     * ipcMain is set in global context for electron and is available this way.
     */
    global.electronGlobal.ipcMain.handle(key, async (event, arg: Input) => {
      const result = await handler(arg, event);

      return result;
    });
  };

  return invoke;
}

export type ElectronChannelSubscriber<T> = (data: T, event: ElectronChannelEventUnified<T>) => void;
export type ElectronSubscribeCleanup = () => void;

interface ElectronChannelEventUnified<T> {
  reply: (data: T) => void;
}

/**
 * Creates bridge channel that can be subscribed on from both sides.
 */
export function createChannelBridge<Data>(key: string) {
  function subscribe(subscriber: ElectronChannelSubscriber<Data>) {
    if (process.env.ELECTRON_CONTEXT === "client") {
      return window.electronBridge.subscribe(key, subscriber);
    } else {
      return global.electronGlobal.subscribe(key, subscriber);
    }
  }

  /**
   * Allows sending messages from client to electron.
   *
   * Important note!
   * There is one 'electron' process, but there can be multiple client processes. (multiple BrowserWindow's)
   *
   * Thus sending client > electron is obvious - there is only one electron, we know where to send it to
   * but sending electron > client also requires specifying to which window we're sending, thus is handled in `sendFromElectron`
   */
  function send(data: Data) {
    if (process.env.ELECTRON_CONTEXT === "client") {
      return window.electronBridge.send(key, data);
    } else {
      throw new Error(
        `If sending messages from electron to client - you need to specify to which window you're sending - use sendFromElectron instead.`
      );
    }
  }

  /**
   * Allows sending data to specified window from electron
   */
  function sendFromElectron(targetWindow: BrowserWindow, data: Data) {
    if (process.env.ELECTRON_CONTEXT === "client") {
      throw new Error(`Cannot use sendFromElectron on client side`);
    }
    targetWindow.webContents.send(key, data);
  }

  return {
    subscribe,
    send,
    sendFromElectron,
  };
}
