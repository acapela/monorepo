import React, { useEffect, useState } from "react";

import { showErrorToUserChannel } from "@aca/desktop/bridge/system";
import { PublicErrorData } from "@aca/desktop/domains/errors/types";

import { MetaToastProps, Toast } from "./Toast";

// Open notifications are neither resolved nor snoozed

export function useKnownErrors() {
  const [errors, setErrors] = useState<PublicErrorData[]>([]);
  useEffect(() => {
    return showErrorToUserChannel.subscribe((newError) => {
      setErrors([newError]);
    });
  });

  function removeError(id: string) {
    setErrors((errors) => errors.filter((currentError) => currentError.id !== id));
  }

  return { errors, removeError };
}

export function renderErrorToasts(
  errors: PublicErrorData[],
  metaProps: MetaToastProps,
  onRemoveRequest?: (errorId: string) => void
) {
  return errors.map((error) => {
    function handleClose() {
      onRemoveRequest?.(error.id);
    }
    return (
      <Toast
        key={error.id}
        id={error.id}
        message={error.message}
        title="Error"
        action={{
          label: "Close",
          callback: handleClose,
        }}
        onCloseRequest={handleClose}
        {...metaProps}
      />
    );
  });
}
