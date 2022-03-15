import { test } from "@playwright/test";
import { _electron as electron } from "playwright";

const launchElectron = () => electron.launch({ args: ["../desktop/dist/electron/index.js"] });

test("Electron app is starting", async () => {
  const electronApp = await launchElectron();
  const window = await electronApp.firstWindow();
  await window.waitForSelector("text=Sign into Acapela");
  await electronApp.close();
});
