import { runInAction } from "mobx";

import { ActionData, ActionResult, resolveActionData } from "@aca/desktop/actions/action";
import { ActionContext, createActionContext, getFrozenActionContext } from "@aca/desktop/actions/action/context";
import { createChannel } from "@aca/shared/channel";

import { trackEvent } from "../analytics";
import { makeLogger } from "./dev/makeLogger";

export const actionResultChannel = createChannel<ActionResult>();

const log = makeLogger("RunAction");

export async function runAction(action: ActionData, context: ActionContext = createActionContext()) {
  if (!action.canApply(context)) {
    return false;
  }

  /**
   * It is possible that handler modifies context implicit target (eg uiStore.focused target) while it executes.
   *
   * This can in turn modify behavior of itself, eg result of canApply.
   *
   * While action is running, provide it with frozen context which will remember all the targets from the moment it was invoked
   */
  const frozenContext = getFrozenActionContext(context);

  try {
    // Let's always run actions as mobx-actions so mobx will not complain
    const actionResult = await runInAction(() => {
      return action.handler(frozenContext);
    });

    const { analyticsEvent } = resolveActionData(action, frozenContext);

    if (analyticsEvent) {
      trackEvent(analyticsEvent.type, Reflect.get(analyticsEvent, "payload"));
    }

    actionResultChannel.publish(actionResult);

    return actionResult;
  } catch (error) {
    /**
     * In case action throws an error, provide every detail we have.
     *
     * It might be very handy as actions are running outside of 'react' and errors can be caused by react
     * eg. 'toggle sidebar' > sidebar renders > sidebar component throws > as a result the very action handler throws as render happens in sync way after the action
     */
    log.error(`Error occured when running action. Logging action, context and error below`, action, frozenContext);
    log.error(error);

    return false;
  }
}

export function runActionWith(action: ActionData, targetOrTargets: unknown) {
  return runAction(action, createActionContext(targetOrTargets));
}
