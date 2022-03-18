import { createInvokeBridge } from "./base/invoke";

export interface ShowDialogInput {
  message: string;
  detail?: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const showConfirmDialogRequest = createInvokeBridge<ShowDialogInput, boolean>("show-dialog");
