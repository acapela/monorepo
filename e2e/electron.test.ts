import path from "path";

import { test } from "@playwright/test";
import { _electron as electron } from "playwright";

const launchElectron = () =>
  electron.launch({
    args: ["../desktop/dist/electron/index.js", "--user-data-dir=/tmp/electron-test-" + new Date().toISOString()],
    cwd: path.join(__dirname, ".."),
  });

test("Electron app is starting", async () => {
  const electronApp = await launchElectron();
  const window = await electronApp.firstWindow();
  await window.waitForSelector("text=Sign into Acapela");
  await electronApp.close();
});
