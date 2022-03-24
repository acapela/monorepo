import { action, makeAutoObservable, observable } from "mobx";

import { removeElementsFromArrayByFilter } from "@aca/shared/array";
import { getUUID } from "@aca/shared/uuid";

export interface ToastInput {
  key?: string;
  title?: string;
  message: string;
  action?: {
    label: string;
    callback: () => void;
  };
  durationMs?: number;
}

export interface ToastData extends ToastInput {
  key: string;
  createdAt: Date;
}

function createToastData(input: ToastInput): ToastData {
  return {
    key: getUUID(),
    createdAt: new Date(),
    ...input,
  };
}

const MAX_TOASTS_COUNT = 3;

export const addToast = action(function addToast(input: ToastInput) {
  const toastData = createToastData(input);

  const currentToastsCount = toastsStore.toasts.length;

  if (currentToastsCount >= MAX_TOASTS_COUNT) {
    toastsStore.toasts.shift();
  }

  toastsStore.toasts.push(toastData);

  return () => {
    removeToast(toastData.key);
  };
});

export function removeToast(key: string) {
  removeElementsFromArrayByFilter(toastsStore.toasts, (toast) => toast.key === key);
}

export const toastsStore = makeAutoObservable(
  {
    toasts: [] as ToastData[],
  },
  { toasts: observable.shallow }
);
