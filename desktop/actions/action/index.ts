import { ReactNode } from "react";

import { MaybeCleanup } from "@aca/shared/types";
import { getUUID } from "@aca/shared/uuid";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { ActionContext, ActionContextCallback, ActionDataThunk, createActionContext } from "./context";
import { ActionGroupData } from "./group";

type ChildActionsResult = {
  isContextual?: boolean;
  searchPlaceholder?: string;
  getActions: (context: ActionContext) => ActionData[];
};

export type ActionResult = ChildActionsResult;
export interface ActionCreateInput {
  id?: string;
  analyticsName?: string;
  name: ActionDataThunk<string>;
  supplementaryLabel?: ActionDataThunk<string | undefined | null>;
  private?: boolean;
  group?: ActionDataThunk<ActionGroupData>;
  keywords?: ActionDataThunk<string[]>;
  shortcut?: ShortcutDefinition;
  onMightBeSelected?: ActionContextCallback<MaybeCleanup>;
  icon?: ActionDataThunk<ReactNode>;
  // If not provided - assumes action can always be applied
  canApply?: ActionContextCallback<boolean>;
  handler: ActionContextCallback<void | ActionResult>;
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
    keywords: resolveActionDataThunk(action.keywords, context),
    group: resolveActionDataThunk(action.group, context),
    supplementaryLabel: resolveActionDataThunk(action.supplementaryLabel, context),
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
  function resolvedRawKeywords(context: ActionContext) {
    if (!input.keywords) return [];
    if (Array.isArray(input.keywords)) {
      return input.keywords;
    }

    return input.keywords(context);
  }
  const action: ActionData = {
    id: getUUID(),
    isAction: actionSymbol,
    canApply: () => true,
    keywords(context) {
      const keywords = resolvedRawKeywords(context);

      const group = resolveActionDataThunk(input.group, context);

      if (group) {
        keywords.push(resolveActionDataThunk(group.name, context));
      }

      const supplementaryLabel = resolveActionDataThunk(input.supplementaryLabel, context);

      if (supplementaryLabel) {
        keywords.push(supplementaryLabel);
      }

      return keywords;
    },
    ...input,
  };

  return action;
}

export function getIsAction(input: unknown): input is ActionData {
  if (!input) return false;

  const typedInput = input as ActionData;

  return typedInput.isAction && typedInput.isAction === actionSymbol;
}

/**
 * Some params of action can be either value of function of context => value. This is helper
 * that resolves this thunk into an actual value.
 */
export function resolveActionDataThunk<T>(thunk: ActionDataThunk<T>, context: ActionContext): T {
  if (typeof thunk === "function") {
    return (thunk as ActionContextCallback<T>)(context);
  }

  return thunk;
}
