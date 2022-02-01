import { createActionContext } from "@aca/desktop/actions/action/context";
import { allActions } from "@aca/desktop/actions/all";

import { CommandMenuSession } from "./session";

export function createDefaultCommandMenuSession(): CommandMenuSession {
  const actionContext = createActionContext();

  return {
    actionContext,
    getActions() {
      return allActions;
    },
  };
}
