import { getUUID } from "@aca/shared/uuid";

import { ActionContext, ActionContextCallback, ActionDataThunk, createActionContext } from "./context";

export interface GroupCreateInput {
  id?: string;
  name: ActionDataThunk<string>;
}

export interface ActionGroupData extends GroupCreateInput {
  id: string;
}

/**
 * Some action fields might be functions that depend on context - this will resolve final data providing some specific context.
 */
export function resolveGroupData(groupData: ActionGroupData, context: ActionContext = createActionContext()) {
  return {
    get name() {
      return resolveActionDataThunk(groupData.name, context);
    },
  };
}

/**
 * Helper that also resolves action data, but requiring target to be provided instead of full context.
 */
export function resolveGroupDataWithTarget(action: ActionGroupData, target?: unknown) {
  const context = createActionContext(target);
  return resolveGroupData(action, context);
}

export function defineGroup(input: GroupCreateInput): ActionGroupData {
  return {
    id: getUUID(),
    ...input,
  };
}

/**
 * Some params of action can be either value of function of context => value. This is helper
 * that resolves this thunk into an actual value.
 */
function resolveActionDataThunk<T>(thunk: ActionDataThunk<T>, context: ActionContext): T {
  if (typeof thunk === "function") {
    return (thunk as ActionContextCallback<T>)(context);
  }

  return thunk;
}
