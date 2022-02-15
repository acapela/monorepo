import { runInAction } from "mobx";

import { ActionData, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext, createActionContext } from "@aca/desktop/actions/action/context";
import { trackEvent } from "@aca/desktop/analytics";

export async function runAction(action: ActionData, context: ActionContext = createActionContext()) {
  const { analyticsEvent } = resolveActionData(action, context);

  if (!action.canApply(context)) {
    return false;
  }

  try {
    // Let's always run actions as mobx-actions so mobx will not complain
    const actionResult = await runInAction(() => {
      return action.handler(context);
    });

    if (analyticsEvent) {
      trackEvent(analyticsEvent.type, Reflect.get(analyticsEvent, "payload"));
    }

    return actionResult;
  } catch (error) {
    /**
     * In case action throws an error, provide every detail we have.
     *
     * It might be very handy as actions are running outside of 'react' and errors can be caused by react
     * eg. 'toggle sidebar' > sidebar renders > sidebar component throws > as a result the very action handler throws as render happens in sync way after the action
     */
    console.error(`Error occured when running action. Logging action, context and error below`, action, context);
    console.error(error);

    return false;
  }
}

export function runActionWithTarget(action: ActionData, target: unknown) {
  return runAction(action, createActionContext(target));
}
