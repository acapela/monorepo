import { createInvokeBridge } from "./base/invoke";

export const restartAppRequest = createInvokeBridge("restart-app");
export const clearAllDataRequest = createInvokeBridge("clear-all-data");
export const toggleMaximizeRequest = createInvokeBridge("toggle-maximize");
export const toggleFullscreenRequest = createInvokeBridge("toggle-fullscreen");
export const openLinkRequest = createInvokeBridge<{ url: string }>("open-link");
