import { runInAction } from "mobx";
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
  isAction: typeof actionSymbol;
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

const actionSymbol = Symbol("action");

export function defineAction(input: ActionCreateInput): ActionData {
  return {
    id: getUUID(),
    isAction: actionSymbol,
    canApply: () => true,
    ...input,
  };
}

export function getIsAction(input: unknown): input is ActionData {
  if (!input) return false;

  const typedInput = input as ActionData;

  return typedInput.isAction && typedInput.isAction === actionSymbol;
}

export function runAction(action: ActionData, context: ActionContext = createActionContext()) {
  if (!action.canApply(context)) {
    return;
  }

  try {
    // Let's always run actions as mobx-actions so mobx will not complain
    runInAction(() => {
      action.handler(context);
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
