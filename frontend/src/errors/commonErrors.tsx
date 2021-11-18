import router from "next/router";
import { ReactNode } from "react";

import { logout } from "~frontend/auth/logout";
import { routes } from "~shared/routes";
import { Button } from "~ui/buttons/Button";

interface CommonErrorAdditionalInfo {
  description?: string;
  renderActions?: () => ReactNode;
}

class CommonError extends Error {
  constructor(message: string, public info?: CommonErrorAdditionalInfo) {
    super(message);
  }
}

export const commonErrors = {
  removedFromCurrentTeam: new CommonError(`You have been removed from current team`, {
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
  sessionInvalid: new CommonError(`You have been logged out`, {
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

export function isCommonError(error: unknown): error is CommonError {
  return error instanceof CommonError;
}
