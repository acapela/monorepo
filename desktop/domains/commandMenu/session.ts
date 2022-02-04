import { cachedComputed } from "@aca/clientdb";
import { ActionData } from "@aca/desktop/actions/action";
import { ActionContext } from "@aca/desktop/actions/action/context";

export interface CommandMenuSession {
  actionContext: ActionContext;
  getActions(context: ActionContext): ActionData[];
}

export function createCommandMenuSession({ getActions, actionContext }: CommandMenuSession): CommandMenuSession {
  return {
    actionContext,
    getActions: cachedComputed((context: ActionContext) => {
      return getActions(context);
    }),
  };
}
