import type { IpcMainInvokeEvent } from "electron";

import { unsafeAssertType } from "@aca/shared/assert";

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
export function createInvokeBridge<Input = void, Result = void>(key: string) {
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
      throw new Error(`No handler initialized`);
    }
    
    try {
      const result = await invokeHandler(arg, event);
      return result;
    } catch (error) {
      unsafeAssertType<Error>(error);
      if (!error) {
        // If we reject promise with null - Electron with crash on calling .toString
        throw new Error(`Invoke handler thrown an error`);
      } else if (typeof error === "string") {
        throw new Error(error);
      } else {
        throw error;
      }
    }
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
