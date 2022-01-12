import { ReactNode } from "react";

import { createChannel } from "@aca/shared/channel";
import { createTimeout } from "@aca/shared/time";

export type ToastType = "success" | "warning" | "error";

const DEFAULT_TOAST_TIMEOUT = 3000;
const DEFAULT_TOAST_WITH_DESCRIPTION_TIMEOUT = 6000;
const MAX_TOASTS_COUNT = 5;

interface ToastAction {
  label: string;
  icon?: ReactNode;
  onSelect: () => void;
}

export interface ToastData {
  type: ToastType;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ToastAction[];
  timeout?: number;
}

const toastsChannel = createChannel<ToastData[]>();

function getToasts() {
  return toastsChannel.getLastValue() ?? [];
}

const getFinalTimeout = ({ timeout, description }: ToastData) => {
  if (timeout) return timeout;

  return description ? DEFAULT_TOAST_WITH_DESCRIPTION_TIMEOUT : DEFAULT_TOAST_TIMEOUT;
};

export function addToast(toast: ToastData) {
  // If no timeout is set, use default value
  toast.timeout = getFinalTimeout(toast);
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
