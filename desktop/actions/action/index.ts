import { ReactNode } from "react";

import { getUUID } from "@aca/shared/uuid";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { ActionContext, createActionContext } from "./context";

type ActionContextCallback<T> = (context: ActionContext) => T;

type ActionDataThunk<T> = T | ActionContextCallback<T>;

export interface ActionCreateInput {
  id?: string;
  analyticsName?: string;
  name: ActionDataThunk<string>;
  keywords?: string[];
  shortcut?: ShortcutDefinition;
  icon?: ActionDataThunk<ReactNode>;
  // If not provided - assumes action can always be applied
  canApply?: ActionContextCallback<boolean>;
  handler: ActionContextCallback<void>;
}

export interface ActionData extends ActionCreateInput {
  id: string;
  canApply: ActionContextCallback<boolean>;
}

/**
 * Some action fields might be functions that depend on context - this will resolve final data providing some specific context.
 */
export function resolveActionData(action: ActionData, context: ActionContext = createActionContext()) {
  return {
    ...action,
    name: resolveActionDataThunk(action.name, context),
    icon: resolveActionDataThunk(action.icon, context),
  };
}

/**
 * Helper that also resolves action data, but requiring target to be provided instead of full context.
 */
export function resolveActionDataWithTarget(action: ActionData, target?: unknown) {
  const context = createActionContext(target);
  return resolveActionData(action, context);
}

export function defineAction(input: ActionCreateInput): ActionData {
  return {
    id: getUUID(),
    canApply: () => true,
    ...input,
  };
}

export function runAction(action: ActionData, context: ActionContext = createActionContext()) {
  if (!action.canApply(context)) {
    return;
  }

  action.handler(context);
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
