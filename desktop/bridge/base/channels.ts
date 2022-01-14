import type { IpcMainInvokeEvent } from "electron";

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
      await global.electronGlobal.appReadyPromise;
      //
      return handleRequest(input);
    }

    return window.electronBridge.invoke(key, input);
  }

  type Handler = (input: Input, event?: IpcMainInvokeEvent) => Promise<Result>;

  let invokeHandler: Handler | null = null;

  /**
   * Function needed to add electron side implementation that can handle given request
   */
  invoke.handle = (handler: Handler) => {
    if (process.env.ELECTRON_CONTEXT === "client") {
      throw new Error(`Cannot handle client side`);
    }

    invokeHandler = handler;
  };

  async function handleRequest(arg: Input, event?: IpcMainInvokeEvent) {
    if (!invokeHandler) {
      throw new Error(`No handler`);
    }
    const result = await invokeHandler(arg, event);

    return result;
  }

  if (process.env.ELECTRON_CONTEXT !== "client") {
    /**
     * Important note - we're not importing `ipcMain` in this file. This file is imported both by client and electron,
     * thus we cannot import any runtime code from electron here.
     *
     * ipcMain is set in global context for electron and is available this way.
     */
    global.electronGlobal.ipcMain.handle(key, async (event, arg: Input) => {
      return handleRequest(arg, event);
    });
  }

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
   */
  function send(data: Data) {
    if (process.env.ELECTRON_CONTEXT === "client") {
      return window.electronBridge.send(key, data);
    } else {
      global.electronGlobal.BrowserWindow.getAllWindows().forEach((targetWindow) => {
        targetWindow.webContents.send(key, data);
      });
    }
  }

  return {
    subscribe,
    send,
  };
}
