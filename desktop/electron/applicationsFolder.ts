import { app, dialog } from "electron";
import IS_DEV from "electron-is-dev";

import { makeLogger } from "@aca/desktop/domains/dev/makeLogger";

import { allowWindowClosing } from "./windows/utils/hideWindowOnClose";

const log = makeLogger("ApplicationsFolder");

function quitApp() {
  allowWindowClosing();
  app.quit();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const [QUIT_ACTION_INDEX, MOVE_ACTION_INDEX] = [0, 1];

export async function ensureAppInApplicationsFolder() {
  if (IS_DEV) {
    return;
  }

  if (app.isInApplicationsFolder()) {
    return;
  }

  app.focus();
  const dialogResponse = await dialog.showMessageBox({
    title: `Move to Applications folder`,
    message: `Acapela needs to be moved to your Applications folder in order to work properly.`,
    buttons: ["Exit", `Move to Applications folder`],
    cancelId: QUIT_ACTION_INDEX,
    defaultId: MOVE_ACTION_INDEX,
  });

  if (dialogResponse.response === QUIT_ACTION_INDEX) {
    return quitApp();
  }

  try {
    // This will quit the app
    app.moveToApplicationsFolder();

    // will not be reached, but adding for readibility
    return;
  } catch (error) {
    log.error(error);
    await dialog.showErrorBox(
      `Failed to move Acapela to Applications folder`,
      `Please try dragging Acapela app into your Applications folder and try again.`
    );
    return quitApp();
  }

  // This should never be reached
}
