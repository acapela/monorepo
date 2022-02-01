import { createBridgeValue } from "./base/persistance";

interface AppWindowValue {
  // Note: as we have browser view, focus 'true' does not mean our React app has focus
  isFocused: boolean;
}

export const appWindowValue = createBridgeValue<AppWindowValue>("app-window", {
  getDefault: () => ({ isFocused: false }),
});
