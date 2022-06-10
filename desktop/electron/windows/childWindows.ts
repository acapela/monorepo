import { BrowserWindow, WebContents } from "electron";

/**
 * We're creating invisible window as a host for child windows.
 *
 * Perfect would be to just use main window. It however, always focuses main window when
 * child is closed. It is often not what we want.
 *
 * I tried to find a way to 'remember previously focused app' and restore it, but was not able to.
 */
const createChildWindowHost = () => {
  const hostWindow = new BrowserWindow({
    width: 900,
    height: 680,
    opacity: 0,
    title: "",
    webPreferences: {
      contextIsolation: true,
      backgroundThrottling: false,
    },
    minWidth: 900,
    minHeight: 680,
    fullscreenable: true,
  });

  hostWindow.setIgnoreMouseEvents(true);

  hostWindow.webContents.on("did-create-window", (childWindow) => {
    childWindow.on("closed", () => {
      hostWindow.close();
    });
  });

  return hostWindow;
};

export function initializeChildWindowHandlers(webContents: WebContents) {
  webContents.setWindowOpenHandler(({ url }) => {
    if (url !== "about:blank") {
      return { action: "deny" };
    }

    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        paintWhenInitiallyHidden: true,
        parent: createChildWindowHost(),
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          backgroundThrottling: false,
        },
      },
    };
  });
}
