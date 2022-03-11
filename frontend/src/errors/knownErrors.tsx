import { signOut } from "next-auth/react";
import { ReactNode } from "react";

import { Button } from "@aca/ui/buttons/Button";

interface CommonErrorAdditionalInfo {
  description?: string;
  renderActions?: () => ReactNode;
}

class KnownError extends Error {
  constructor(message: string, public info?: CommonErrorAdditionalInfo) {
    super(message);
  }
}

export const knownErrors = {
  sessionInvalid: new KnownError(`You have been logged out`, {
    description: "Please log in again",
    renderActions() {
      return (
        <Button
          kind="primary"
          onClick={() => {
            signOut({ callbackUrl: "/" });
          }}
        >
          Login
        </Button>
      );
    },
  }),
};

export function isKnownError(error: unknown): error is KnownError {
  return error instanceof KnownError;
}
