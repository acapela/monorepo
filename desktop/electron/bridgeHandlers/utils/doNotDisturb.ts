import { createSharedPromise } from "@aca/shared/promises";
// import { SECOND, createInterval } from "@aca/shared/time";

async function _waitForDoNotDisturbToEnd() {
  return true;

  // return new Promise<boolean>((resolve) => {
  //   const stop = createInterval(() => {
  //     if (getDoNotDisturb()) return;
  //
  //     stop();
  //     resolve(true);
  //   }, 3 * SECOND);
  // });
}

export const waitForDoNotDisturbToEnd = createSharedPromise(_waitForDoNotDisturbToEnd);
