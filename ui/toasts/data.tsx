import { ReactNode } from "react";
import { createChannel } from "~shared/channel";
import { createTimeout } from "~shared/time";

export type ToastType = "info" | "success" | "error";

export type ToastPlacement = "bottom-center" | "center";

const DEFAULT_TOAST_TIMEOUT = 3000;
const MAX_TOASTS_COUNT = 5;

interface ToastAction {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface ToastData {
  type: ToastType;
  content: ReactNode;
  supportingContent?: ReactNode;
  placement?: ToastPlacement;
  icon?: ReactNode;
  actions?: ToastAction[];
  timeout?: number;
}

const toastsChannel = createChannel<ToastData[]>();

function getToasts() {
  return toastsChannel.getLastValue() ?? [];
}

export function addToast(toast: ToastData) {
  // If no timeout is set, use default value
  toast = { timeout: DEFAULT_TOAST_TIMEOUT, ...toast };
  const newToasts = [toast, ...getToasts()].slice(0, MAX_TOASTS_COUNT);

  toastsChannel.publish(newToasts);

  if (toast.timeout && toast.timeout > 0) {
    createTimeout(() => {
      removeToast(toast);
    }, toast.timeout);
  }

  return function remove() {
    removeToast(toast);
  };
}

export function removeToast(toast: ToastData) {
  const remainingToasts = getToasts().filter((existingToast) => existingToast !== toast);

  toastsChannel.publish(remainingToasts);
}

export function useToasts() {
  return toastsChannel.useLastValue() ?? [];
}
