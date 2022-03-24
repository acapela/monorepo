import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";

import { removeToast, toastsStore } from "@aca/desktop/domains/toasts/store";
import { SECOND } from "@aca/shared/time";

import { Toast } from "./Toast";

interface Props {
  shouldPauseAutohide: boolean;
}

export const ToastsFromStore = observer(({ shouldPauseAutohide }: Props) => {
  const { toasts } = toastsStore;

  return (
    <>
      <AnimatePresence>
        {toasts.slice(-3).map((toastData) => {
          return (
            <Toast
              id={toastData.key}
              key={toastData.key}
              title={toastData.title}
              description={toastData.message}
              autoCloseAfterMs={toastData.durationMs ?? SECOND * 3}
              onCloseRequest={() => {
                removeToast(toastData.key);
              }}
              actionLabel={toastData.action}
              pauseAutoHide={shouldPauseAutohide}
            />
          );
        })}
      </AnimatePresence>
    </>
  );
});
