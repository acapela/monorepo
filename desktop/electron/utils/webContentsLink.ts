import { WebContents } from "electron";

import { removePrefix } from "@aca/shared/text/substring";
import { MaybeCleanup } from "@aca/shared/types";

/**
 * This file allows communication between electron and any view or window without setting up ipc.
 */

/**
 * Allows sending arbitral 'typescript' to any view or window.
 *
 * This allows us to have 'typescript-like' IDE experience.
 *
 * So you can do something like:
 *
 * evaluateFunctionInWebContents(view.webContents, () => {
 *   alert("Hello from the inside" as string)
 * })
 *
 * instead of:
 *
 * view.webContents.executeJavaScript(`alert("Hello from the inside")`);
 *
 * Note: you cannot use anything that lives outside of provided function. Treat it as if you'd copy-paste given
 * function, transpile it ts>js and paste into dev-tools console
 */

// We'll assign temp variables in window of given view/window - let's keep track of it.
let uniqueWindowNameCounter = 0;

function setupBridgeIfNeeded() {
  if (window.webContentsBridge) return;

  window.webContentsBridge = {
    sendMessage(data) {
      const bodyJSON = JSON.stringify(data);
      console.info(`__electron ${bodyJSON}`);
    },
  };

  return null;
}

async function initializeBridgeForWebContents(web: WebContents) {
  const initCode = getCallCodeForFunction(setupBridgeIfNeeded);
  await guardedExecuteJavaScript(web, initCode);
}

async function guardedExecuteJavaScript<T>(webContents: WebContents, code: string) {
  try {
    const result = await webContents.executeJavaScript(code, true);

    return result as T;
  } catch (error) {
    console.error(`Failed to execute javascript in webContents`, code, error);
  }
}

export async function evaluateFunctionInWebContents<R, A extends unknown[]>(
  web: WebContents,
  callback: (...args: A) => R,
  ...args: A
) {
  const callbackCode = getCallCodeForFunction(callback, ...args);

  await initializeBridgeForWebContents(web);

  const result = await guardedExecuteJavaScript(web, callbackCode);

  return result as R;
}

export function runEffectInWebContents<Return = void, Input = undefined>(
  web: WebContents,
  callback: (send: (data: Return) => void, input?: Input) => MaybeCleanup,
  onData?: (data: Return) => void,
  input?: Input
) {
  const bridgeId = `${uniqueWindowNameCounter++}`;

  interface Message {
    type: "webcontents-communication";
    bridgeId: string;
    data: Return;
  }

  const sendFunctionName = `__bridge_send${bridgeId}`;
  const cleanupName = `__bridge_send_cleanup${bridgeId}`;
  const inputDataName = `__bridge_data_input${bridgeId}`;

  const sendFunction = getCallCodeForFunction((bridgeId: string) => {
    return function send(data: Return) {
      window.webContentsBridge.sendMessage<Message>({
        bridgeId,
        type: "webcontents-communication",
        data,
      });
    };
  }, bridgeId);

  const initPromise = guardedExecuteJavaScript(
    web,
    [
      getCallCodeForFunction(setupBridgeIfNeeded),
      `window.${sendFunctionName} = ${sendFunction}`,
      `window.${inputDataName} = ${input && JSON.stringify(input)}`,
      `window.${cleanupName} = (${getFunctionCode(callback)})(window.${sendFunctionName}, window.${inputDataName})`,
      // We don't want this block to return non-serializable result that would throw
      "0",
    ].join(";")
  );

  const stopListening = listenForWebContentsConsoleMessage<Message>(web, (message) => {
    if (message?.type !== "webcontents-communication") return;
    if (message.bridgeId !== bridgeId) return;

    onData?.(message.data);
  });

  async function cleanupCode() {
    if (web.isDestroyed()) return;

    await guardedExecuteJavaScript(
      web,
      [
        `delete window.${sendFunctionName}`,
        `delete window.${cleanupName}`,
        `delete window.${inputDataName}`,
        // We don't want this block to return non-serializable result that would throw
        "0",
      ].join(";")
    );
  }

  return async () => {
    stopListening();
    await initPromise;
    await cleanupCode();
  };
}

interface WebContentsBridge {
  sendMessage<T = unknown>(body: T): void;
}

declare global {
  interface Window {
    webContentsBridge: WebContentsBridge;
  }
}

function getFunctionCode<A extends unknown[]>(callback: (...args: A) => void) {
  const functionDefinitionCode = callback.toString();

  return functionDefinitionCode;
}

function getCallCodeForFunction<A extends unknown[]>(callback: (...args: A) => void, ...args: A) {
  const functionDefinitionCode = getFunctionCode(callback);

  /**
   * (function foo(a) {
   *    console.log(a)
   * })(1)
   *
   * (<BODY>)(1)
   */

  const callableArgs = args.map((arg) => JSON.stringify(arg)).join(", ");

  return `(${functionDefinitionCode})(${callableArgs})`;
}

/**
 * This allows primitive communication with any web-contents without setting up ipc.
 *
 * The only option that seems to make sense is listening to console logs on electron side
 *
 * Convention is: execute console.log("electron", "anything-here") and callback with "anything-here" will be called
 *
 * TODO: with a bit of effort we can send any JSON this way
 */
function listenForWebContentsConsoleMessage<T = unknown>(web: WebContents, callback: (message: T) => void) {
  function handleConsoleMessage(event: Electron.Event, line: number, message: string) {
    if (!message.startsWith("__electron ")) return;
    const bodyJSON = removePrefix(message, "__electron ");
    try {
      const body = JSON.parse(bodyJSON);

      callback(body);
    } catch (error) {
      console.warn(`Incorrect __electron message json: ${bodyJSON}`);
    }
  }
  web.on("console-message", handleConsoleMessage);

  return () => {
    web.off("console-message", handleConsoleMessage);
  };
}

/**
 * Electron does not provide an easy way to listen to focus/blur of any webContents (view or window).
 * https://github.com/electron/electron/issues/22201
 *
 * This workarounds that by injecting normal focus/blur events and sending info about them without IPC setup
 */
export function listenToWebContentsFocus(web: WebContents, callback: (isFocused: boolean) => void) {
  return runEffectInWebContents<boolean>(
    web,
    (send) => {
      function handleFocus() {
        send(true);
      }

      function handleBlur() {
        send(false);
      }
      window.addEventListener("focus", handleFocus);
      window.addEventListener("blur", handleBlur);

      return () => {
        window.removeEventListener("focus", handleFocus);
        window.removeEventListener("blur", handleBlur);
      };
    },
    callback
  );
}
