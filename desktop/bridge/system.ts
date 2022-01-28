import { createInvokeBridge } from "./base/channels";

export const requestRestartApp = createInvokeBridge("restart-app");
export const clearAllData = createInvokeBridge("clear-all-data");
export const toggleMaximize = createInvokeBridge("toggle-maximize");
