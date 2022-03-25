import { createChannelBridge } from "./base/channels";
import { createBridgeValue } from "./base/persistance";

export interface ToastBridgeData {
  key: string;
  title?: string;
  message: string;
  action?: {
    label: string;
  };
  durationMs?: number;
}

export const toastsStateBridge = createBridgeValue("toastsStateBridge", {
  getDefault: () => ({
    toasts: [] as ToastBridgeData[],
  }),
});

export const toastActionClickedBridgeChannel = createChannelBridge<ToastBridgeData>("toastActionClickedBridgeChannel");
export const toastsHeightChangeBridgeChannel = createChannelBridge<number>("toastsHeightChangeBridgeChannel");
