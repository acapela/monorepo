import { runInAction } from "mobx";

import { devAssignWindowVariable } from "@aca/shared/dev";

import { ActionData } from "../actions/action";
import { ActionContext, createActionContext } from "../actions/action/context";
import { createCommandMenuSession } from "./commandMenu/session";
import { commandMenuStore } from "./commandMenu/store";

export function runAction(action: ActionData, context: ActionContext = createActionContext()) {
  if (!action.canApply(context)) {
    return;
  }

  try {
    // Let's always run actions as mobx-actions so mobx will not complain
    const actionResult = runInAction(() => {
      return action.handler(context);
    });

    if (!actionResult) return;

    context.searchKeyword = "";

    devAssignWindowVariable("ctx", context);

    commandMenuStore.session = createCommandMenuSession({
      actionContext: createActionContext(context.forcedTarget, {
        isContextual: context.isContextual,
        searchPlaceholder: actionResult.searchPlaceholder,
      }),
      getActions(context) {
        return actionResult.getActions(context);
      },
    });
  } catch (error) {
    /**
     * In case action throws an error, provide every detail we have.
     *
     * It might be very handy as actions are running outside of 'react' and errors can be caused by react
     * eg. 'toggle sidebar' > sidebar renders > sidebar component throws > as a result the very action handler throws as render happens in sync way after the action
     */
    console.error(`Error occured when running action. Logging action, context and error below`, action, context);
    console.error(error);
  }
}

export function runActionWithTarget(action: ActionData, target: unknown) {
  return runAction(action, createActionContext(target));
}
