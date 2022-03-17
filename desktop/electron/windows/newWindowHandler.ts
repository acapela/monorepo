import { MaybeCleanup } from "@aca/shared/types";
import { getUUID } from "@aca/shared/uuid";
import { BrowserWindow, BrowserWindowConstructorOptions, DidCreateWindowDetails, app } from "electron";

/**
 * We're creating invisible window as a host for child windows.
 *
 * Perfect would be to just use main window. It however, always focuses main window when
 * child is closed. It is often not what we want.
 *
 * I tried to find a way to 'remember previously focused app' and restore it, but was not able to.
 */
const createChildWindowHost = (initializer: (window: BrowserWindow) => void) => {
  const hostWindow = new BrowserWindow({
    width: 900,
    height: 680,
    opacity: 0,
    title: "",
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
    },
    alwaysOnTop: true,
    minWidth: 900,
    minHeight: 680,
    fullscreenable: true,
  });

  hostWindow.setIgnoreMouseEvents(true, { forward: true });

  function handleNewWindow(event: Electron.Event, newWindow: BrowserWindow) {
    if (newWindow.getParentWindow() !== hostWindow) {
      return;
    }

    initializer(newWindow);

    newWindow.once("closed", () => {
      hostWindow.close();
    });

    app.off("browser-window-created", handleNewWindow);
  }

  app.on("browser-window-created", handleNewWindow);

  return hostWindow;
};

export type NewWindowHandler = {
  overrides?: BrowserWindowConstructorOptions;
  initializer?: (newWindow: BrowserWindow) => MaybeCleanup;
};

type AllowedWindowCreationResult = {
  action: "allow";
  overrideBrowserWindowOptions?: BrowserWindowConstructorOptions;
};

export function handleCreatingNewWindow(
  { initializer, overrides }: NewWindowHandler,
  parentWindow: BrowserWindow
): AllowedWindowCreationResult {
  const id = getUUID();

  function handleNewWindow(newWindow: BrowserWindow, details: DidCreateWindowDetails) {
    console.log(
      "NEW WINDOW",
      { id },
      newWindow.getTitle(),
      newWindow.title,
      newWindow.webContents,
      JSON.stringify(newWindow)
    );
    console.log(newWindow);
    if (newWindow.getTitle() !== id) {
      return;
    }

    initializer?.(newWindow);

    parentWindow.webContents.off("did-create-window", handleNewWindow);
  }

  parentWindow.webContents.on("did-create-window", handleNewWindow);

  return {
    action: "allow",
    overrideBrowserWindowOptions: {
      webPreferences: {
        ...overrides?.webPreferences,
      },
      parent: parentWindow,
      ...overrides,
      title: id,
    },
  };
}
