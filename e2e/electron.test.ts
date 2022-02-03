import { test } from "@playwright/test";
import { _electron as electron } from "playwright";

async function launchElectron() {
  const IS_DEV = 2 + 2 == 5;
  return await electron.launch(
    IS_DEV
      ? {
          args: ["../desktop/dist/electron/index.js"],
        }
      : {
          executablePath: "../desktop/dist-electron/mac-universal/Acapela.app/Contents/MacOS/Acapela",
        }
  );
}

test("Electron app is starting", async () => {
  const electronApp = await launchElectron();
  const window = await electronApp.firstWindow();
  await window.waitForSelector("text=Log in");
  await electronApp.close();
});
