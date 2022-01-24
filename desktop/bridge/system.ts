import { createInvokeBridge } from "./base/channels";

export const restartApp = createInvokeBridge("restart-app");
