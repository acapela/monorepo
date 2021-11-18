import router from "next/router";
import { ReactNode } from "react";

import { logout } from "~frontend/auth/logout";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";

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
  removedFromCurrentTeam: new KnownError(`You have been removed from current team`, {
    description: "Please select other team or create a new one",
    renderActions() {
      return (
        <Button
          kind="primary"
          onClick={() => {
            router.push(routes.teamSelect);
          }}
        >
          Change team
        </Button>
      );
    },
  }),
  sessionInvalid: new KnownError(`You have been logged out`, {
    description: "Please log in again",
    renderActions() {
      return (
        <Button
          kind="primary"
          onClick={() => {
            logout();
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
