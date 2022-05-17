import React from "react";

import { ToastBridgeData, toastActionClickedBridgeChannel } from "@aca/desktop/bridge/toasts";
import { removeToast } from "@aca/desktop/domains/toasts/store";
import { SECOND } from "@aca/shared/time";

import { MetaToastProps, Toast } from "./Toast";

interface Props extends MetaToastProps {
  toast: ToastBridgeData;
}

export function BridgeToast({ toast, pauseAutoHide, disablePositionalAnimations, animationsDelay }: Props) {
  const { key, message, action, durationMs = 3 * SECOND, title, isInfinite = false } = toast;

  return (
    <Toast
      id={key}
      message={message}
      title={title}
      action={
        action
          ? {
              label: action.label,
              callback: () => {
                toastActionClickedBridgeChannel.send(toast);
                removeToast(key);
              },
            }
          : undefined
      }
      animationsDelay={animationsDelay}
      disablePositionalAnimations={disablePositionalAnimations}
      durationMs={durationMs}
      pauseAutoHide={pauseAutoHide}
      isInfinite={isInfinite}
    />
  );
}
