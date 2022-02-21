import type { IpcMainInvokeEvent } from "electron";

import { createLogger } from "@aca/shared/log";
import { MaybePromise, resolveMaybePromise } from "@aca/shared/promises";
import { getUUID } from "@aca/shared/uuid";

import { createInvokeBridge } from "./invoke";

type Cleanup = () => void;
type MaybeCleanup = Cleanup | void;

const cleanupBridge = createInvokeBridge<{ id: string }, boolean>("performCleanup");

const cleanups = new Map<string, MaybeCleanup>();

export function initializeCleanupsHandler() {
  if (process.env.ELECTRON_CONTEXT !== "client") {
    cleanupBridge.handle(async ({ id }) => {
      if (!cleanups.has(id)) {
        console.warn("No cleanup");
        return false;
      }
      const cleanup = cleanups.get(id);

      if (!cleanup) return false;

      cleanup();

      cleanups.delete(id);

      return true;
    });
  }
}

/**
 * Will create 'request' bridge - promise style requests from client to electron.
 *
 * Each invoke bridge needs to have handler added somewhere in electron to be able to be invoked.
 */
export function createInvokeWithCleanupBridge<Input = void>(key: string) {
  const log = createLogger(key, false);
  type InnerInput = { input: Input; cleanupId: string };
  const initKey = `${key}_init`;
  function invoke(input: Input): MaybeCleanup {
    if (process.env.ELECTRON_CONTEXT !== "client") {
      global.electronGlobal.appReadyPromise;
      //
      const result = resolveMaybePromise(handleRequest(input));

      return function cleanup() {
        result.then((maybeCleanup) => {
          maybeCleanup?.();
        });
      };
    }

    // Client side
    log("invoke", input);

    const cleanupId = getUUID();

    const innerInput: InnerInput = { input, cleanupId };

    const invokePromise = window.electronBridge.invoke(initKey, innerInput);

    return function clean() {
      log("clean", cleanupId);
      invokePromise.then(() => {
        log("clean done", cleanupId);
        cleanupBridge({ id: cleanupId });
      });
    };
  }

  type Handler = (input: Input, event?: IpcMainInvokeEvent) => MaybePromise<MaybeCleanup>;

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

  function handleRequest(arg: Input, event?: IpcMainInvokeEvent) {
    if (!invokeHandler) {
      throw new Error(`No handler for arg ${JSON.stringify(arg)} given event ${JSON.stringify(event)}`);
    }
    const cleanup = invokeHandler(arg, event);

    return cleanup;
  }

  if (process.env.ELECTRON_CONTEXT !== "client") {
    global.electronGlobal.ipcMain.handle(initKey, async (event, { cleanupId, input }: InnerInput) => {
      const maybeCleanup = await handleRequest(input, event);

      cleanups.set(cleanupId, maybeCleanup);
    });
  }

  return invoke;
}
