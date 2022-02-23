import { test } from "@playwright/test";
import { _electron as electron } from "playwright";

import { IS_CI } from "./helper/utils";

const launchElectron = () =>
  electron.launch(
    IS_CI
      ? {
          executablePath: "./start-electron.sh",
        }
      : {
          args: ["../desktop/dist/electron/index.js"],
        }
  );

test("Electron app is starting", async () => {
  const electronApp = await launchElectron();
  const window = await electronApp.firstWindow();
  await window.waitForSelector("text=Sign into Acapela");
  await electronApp.close();
});
