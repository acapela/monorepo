import path from "path";

import { BrowserWindow, app } from "electron";
import IS_DEV from "electron-is-dev";

// Note - please always use 'path' module for paths (especially with slashes) instead of eg `${pathA}/${pathB}` to avoid breaking it on windows.
// Note - do not use relative paths without __dirname
const BUILD_PATH = path.resolve(__dirname, "../build");
const INDEX_HTML_FILE = path.resolve(BUILD_PATH, "index.html");

// Note - in case we'll use multiple windows, create some solid abstraction on setting and unsetting open windows.
// Reference to main, opened window
let mainWindow: BrowserWindow | null;

function initializeMainWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
  });

  mainWindow.loadURL(
    IS_DEV
      ? // In dev mode - load from local dev server
        "http://localhost:3000"
      : // In production - load static, bundled file
        `file://${INDEX_HTML_FILE}`
  );

  mainWindow.on("closed", () => {
    mainWindow = null;
    //
  });
}

function initializeApp() {
  initializeMainWindow();
}

app.on("ready", initializeApp);

app.on("window-all-closed", () => {
  // On Mac - closing app window does not quit it - it can still be visible in system 'cmd-tab' etc.
  if (process.platform === "darwin") {
    return;
  }
  app.quit();
});

// If all windows are closed and you eg 'cmd-tab' into the app - re-initialize the window
app.on("activate", () => {
  if (mainWindow === null) {
    initializeMainWindow();
  }
});
