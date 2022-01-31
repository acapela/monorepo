import { WebContents } from "electron";

import { removePrefix } from "@aca/shared/text/substring";

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

let uniqueWindowNameCounter = 0;

export async function evaluateFunctionInWebContents<R>(web: WebContents, callback: () => R) {
  // Get source of given function
  const functionDefinitionCode = callback.toString();

  // We'll assign it to temp window variable - let's remember this temp name
  const TEMP_FUNCTION_NAME = `__evaluate__callback${uniqueWindowNameCounter++}`;

  const codeToExecute = [
    // Assign it to temp variable
    `window.${TEMP_FUNCTION_NAME} = ${functionDefinitionCode}`,
    // Execute it
    `window.${TEMP_FUNCTION_NAME}()`,
  ].join(";");

  // Assign type-safe result
  const resultPromise: Promise<R> = web.executeJavaScript(
    codeToExecute,
    // Treat as trusted event (eg same as elevated code inside click events)
    true
  );

  // Now we can also remove this temp function to avoid polluting window
  const cleanupCode = `delete window.${TEMP_FUNCTION_NAME}`;

  web.executeJavaScript(cleanupCode);

  const result = await resultPromise;

  return result;
}

type Cleanup = () => void;

/**
 * Allows injecting any code into web contents with some cleanup code.
 *
 * const stop = evaluateFunctionWithCleanupInWebContents(web, () => {
 *   const i = setTimeout(stuff);
 *
 *   return () => clearTimeout(i);
 * })
 */
export function evaluateFunctionWithCleanupInWebContents(web: WebContents, callback: () => Cleanup) {
  const functionDefinitionCode = callback.toString();

  const TEMP_FUNCTION_NAME = `__evaluate__callback${uniqueWindowNameCounter++}`;
  const TEMP_CLEANUP_NAME = `__evaluate__callback_cleanup${uniqueWindowNameCounter++}`;

  const codeToExecute = [
    `window.${TEMP_FUNCTION_NAME} = ${functionDefinitionCode}`,
    `window.${TEMP_CLEANUP_NAME} = window.${TEMP_FUNCTION_NAME}()`,
    `delete window.${TEMP_FUNCTION_NAME}`,
  ].join(";");

  const resultPromise = web.executeJavaScript(
    codeToExecute,
    // Treat as trusted event (eg same as elevated code inside click events)
    true
  );

  return async function cleanup() {
    await resultPromise;
    await web.executeJavaScript([`window.${TEMP_CLEANUP_NAME}()`, `delete window.${TEMP_CLEANUP_NAME}`].join(";"));
  };
}

/**
 * This allows primitive communication with any web-contents without setting up ipc.
 *
 * Convention is: execute console.log("electron", "anything-here") and callback with "anything-here" will be called
 *
 * TODO: with a bit of effort we can send any JSON this way
 */
export function listenForWebContentsConsoleMessage(web: WebContents, callback: (message: string) => void) {
  function handleConsoleMessage(event: Electron.Event, line: number, message: string) {
    if (!message.startsWith("electron ")) return;
    const body = removePrefix(message, "electron ");

    callback(body);
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
  // Get initial focus and call callback
  evaluateFunctionInWebContents(web, () => {
    return document.hasFocus();
  }).then((initialHasFocus) => {
    callback(initialHasFocus);
  });

  // Start listening for messages from console
  const cancelConsoleListening = listenForWebContentsConsoleMessage(web, (message) => {
    if (message === "has-focus") {
      callback(true);
    }
    if (message === "lost-focus") {
      callback(false);
    }
    //
  });

  // Inject focus/blur events with proper cleanup
  const stopListeningForEvents = evaluateFunctionWithCleanupInWebContents(web, () => {
    function handleFocus() {
      console.info("electron", "has-focus");
    }

    function handleBlur() {
      console.info("electron", "lost-focus");
    }
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  });

  return () => {
    cancelConsoleListening();
    stopListeningForEvents();
  };
}
