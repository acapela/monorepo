import { action } from "mobx";

import { ToastBridgeData, toastActionClickedBridgeChannel, toastsStateBridge } from "@aca/desktop/bridge/toasts";
import { removeElementsFromArrayByFilter } from "@aca/shared/array";
import { mobxItemAddedToArrayEffect } from "@aca/shared/mobx/utils";
import { SECOND } from "@aca/shared/time";
import { getUUID } from "@aca/shared/uuid";

export interface ToastInput {
  key?: string;
  title: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
  durationMs?: number;
}

function createToastData({
  key = getUUID(),
  message,
  action,
  durationMs = 3 * SECOND,
  title,
}: ToastInput): ToastBridgeData {
  return {
    key,
    message,
    durationMs,
    title,
    action: action ? { label: action.label } : undefined,
  };
}

const MAX_TOASTS_COUNT = 1;

const registeredToastCallbacks = new Map<string, () => void>();

mobxItemAddedToArrayEffect(
  () => toastsStateBridge.get().toasts,
  (addedToastData) => {
    return () => {
      registeredToastCallbacks.delete(addedToastData.key);
    };
  }
);

toastActionClickedBridgeChannel.subscribe((clickedToast) => {
  const callback = registeredToastCallbacks.get(clickedToast.key);

  if (!callback) return;

  registeredToastCallbacks.delete(clickedToast.key);

  callback();
});

export const addToast = action(function addToast(input: ToastInput) {
  const toastData = createToastData(input);

  if (input.action) {
    registeredToastCallbacks.set(toastData.key, input.action.callback);
  }

  toastsStateBridge.update(({ toasts: currentToasts }) => {
    const currentToastsCount = currentToasts.length;

    if (currentToastsCount >= MAX_TOASTS_COUNT) {
      currentToasts.shift();
    }

    currentToasts.push(toastData);
  });

  return () => {
    removeToast(toastData.key);
  };
});

export function removeToast(key: string) {
  toastsStateBridge.update(({ toasts: currentToasts }) => {
    removeElementsFromArrayByFilter(currentToasts, (toast) => toast.key === key);
  });
}
