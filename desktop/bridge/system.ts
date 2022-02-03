import { createInvokeBridge } from "./base/invoke";
import { createBridgeValue } from "./base/persistance";

export const restartAppRequest = createInvokeBridge("restart-app");
export const clearAllDataRequest = createInvokeBridge("clear-all-data");
export const toggleMaximizeRequest = createInvokeBridge("toggle-maximize");
export const toggleFullscreenRequest = createInvokeBridge("toggle-fullscreen");
export const toggleDevtoolsRequest = createInvokeBridge<boolean>("toggle-devtools");

export const openLinkRequest = createInvokeBridge<{ url: string }>("open-link");

export const isFullscreenValue = createBridgeValue<boolean>("is-fullscreen", {
  getDefault() {
    return false;
  },
});
