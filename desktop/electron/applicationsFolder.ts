import { app, dialog } from "electron";
import IS_DEV from "electron-is-dev";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { allowWindowClosing } from "./windows/utils/hideWindowOnClose";

const log = makeLogger("ApplicationsFolder");

function quitApp() {
  allowWindowClosing();
  app.quit();
}

export async function ensureAppInApplicationsFolder() {
  if (IS_DEV) {
    return true;
  }

  if (app.isInApplicationsFolder()) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [QUIT_ACTION_INDEX, MOVE_ACTION_INDEX] = [0, 1];

  const dialogResponse = await dialog.showMessageBox({
    title: `Move Acapela to "Applications" folder`,
    message: `In order for Acapela to work properly it must be in your  - Acapela needs to be in your Applications folder`,
    buttons: ["Quit", `Move to "Applications" folder`],
    cancelId: QUIT_ACTION_INDEX,
    defaultId: MOVE_ACTION_INDEX,
  });

  if (dialogResponse.response !== MOVE_ACTION_INDEX) {
    quitApp();
    return false;
  }

  try {
    const didMove = app.moveToApplicationsFolder();

    if (didMove) {
      return true;
    }
  } catch (error) {
    log.error(error);
    await dialog.showErrorBox(
      `Failed to move Acapela to "Applications" folder`,
      `In order for Acapela to work properly it must be in your  - Acapela needs to be in your Applications folder`
    );
  }

  quitApp();
}
