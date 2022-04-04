import React, { useRef } from "react";

import { ToastBridgeData, toastActionClickedBridgeChannel } from "@aca/desktop/bridge/toasts";
import { removeToast } from "@aca/desktop/domains/toasts/store";
import { emptyFunction } from "@aca/shared/functions";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { useMethod } from "@aca/shared/hooks/useMethod";
import { usePausableTimeout } from "@aca/shared/hooks/usePausableTimeout";
import { DAY, SECOND } from "@aca/shared/time";

import { MetaToastProps, Toast } from "./Toast";

interface Props extends MetaToastProps {
  toast: ToastBridgeData;
}

export function BridgeToast({ toast, pauseAutoHide, disablePositionalAnimations, animationsDelay }: Props) {
  const { key, message, action, durationMs = 3 * SECOND, title } = toast;

  function onCloseRequest() {
    removeToast(key);
  }

  const toastRef = useRef<HTMLDivElement>(null);
  const onCloseRequestRef = useMethod(onCloseRequest ?? emptyFunction);
  const isHovered = useIsElementOrChildHovered(toastRef);

  const shouldPlayAutoHide = !pauseAutoHide && !isHovered && !!durationMs;

  usePausableTimeout(durationMs ?? DAY, shouldPlayAutoHide, () => {
    onCloseRequestRef();
  });

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
      onCloseRequest={() => {
        removeToast(key);
      }}
      animationsDelay={animationsDelay}
      disablePositionalAnimations={disablePositionalAnimations}
      durationMs={durationMs}
      pauseAutoHide={pauseAutoHide}
    />
  );
}
