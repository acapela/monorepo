import { getDoNotDisturb } from "electron-notification-state";

import { createSharedPromise } from "@aca/shared/promises";
import { SECOND, createInterval } from "@aca/shared/time";

async function _waitForDoNotDisturbToEnd() {
  if (!getDoNotDisturb()) return true;

  return new Promise<boolean>((resolve) => {
    const stop = createInterval(() => {
      if (getDoNotDisturb()) return;

      stop();
      resolve(true);
    }, 3 * SECOND);
  });
}

export const waitForDoNotDisturbToEnd = createSharedPromise(_waitForDoNotDisturbToEnd);
