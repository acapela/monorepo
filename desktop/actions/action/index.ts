import { ReactNode } from "react";

import { cachedComputed } from "@aca/clientdb";
import { MaybePromise } from "@aca/shared/promises";
import { MaybeCleanup } from "@aca/shared/types";
import { AnalyticsEventInput, resolveAnalyticsEventInput } from "@aca/shared/types/analytics";
import { getUUID } from "@aca/shared/uuid";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { ActionContext, ActionContextCallback, ActionDataThunk, createActionContext } from "./context";
import { ActionGroupData } from "./group";

type ChildActionsResult = {
  isContextual?: boolean;
  initialSearchValue?: string;
  hideTarget?: boolean;
  searchPlaceholder?: string;
  getActions: (context: ActionContext) => ActionData[];
};

export type ActionResult = ChildActionsResult | false | void;

export type ActionHandlerResult = MaybePromise<ActionResult>;

export interface ActionCreateInput {
  id?: string;
  analyticsName?: string;
  name: ActionDataThunk<string>;
  supplementaryLabel?: ActionDataThunk<string | undefined | null>;
  analyticsEvent?: ActionDataThunk<AnalyticsEventInput | undefined>;
  private?: boolean;
  group?: ActionDataThunk<ActionGroupData>;
  alwaysShowInSearch?: boolean;
  keywords?: ActionDataThunk<string[]>;
  shortcut?: ShortcutDefinition;
  onMightBeSelected?: ActionContextCallback<MaybeCleanup>;
  icon?: ActionDataThunk<ReactNode>;
  // If not provided - assumes action can always be applied
  canApply?: ActionContextCallback<boolean>;
  handler: ActionContextCallback<ActionHandlerResult>;
}

export interface ActionData extends ActionCreateInput {
  id: string;
  isAction: typeof actionSymbol;
  canApply: ActionContextCallback<boolean>;
}

/**
 * Some action fields might be functions that depend on context - this will resolve final data providing some specific context.
 */
export const resolveActionData = cachedComputed(function resolveActionData(action: ActionData, context: ActionContext) {
  return {
    canApply: cachedComputed(action.canApply),
    id: action.id,
    get name() {
      return resolveActionDataThunk(action.name, context);
    },
    get icon() {
      return resolveActionDataThunk(action.icon, context);
    },
    get shortcut() {
      return action.shortcut;
    },
    get keywords() {
      return resolveActionDataThunk(action.keywords, context);
    },
    get group() {
      return resolveActionDataThunk(action.group, context);
    },
    get supplementaryLabel() {
      return resolveActionDataThunk(action.supplementaryLabel, context);
    },
    get isApplicable() {
      return action.canApply(context);
    },
    get analyticsEvent() {
      const eventInput = resolveActionDataThunk(action.analyticsEvent, context);
      if (!eventInput) return;

      return resolveAnalyticsEventInput(eventInput);
    },
  };
});

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
    ...input,
    keywords: cachedComputed(function actionKeywords(context) {
      const keywords = [...resolvedRawKeywords(context)];

      const supplementaryLabel = resolveActionDataThunk(input.supplementaryLabel, context);

      if (supplementaryLabel) {
        keywords.push(supplementaryLabel);
      }

      const group = resolveActionDataThunk(input.group, context);

      if (group) {
        keywords.push(resolveActionDataThunk(group.name, context));
      }

      return keywords;
    }),
    canApply: cachedComputed(function actionCanApply(context) {
      if (!input.canApply) return true;

      return input.canApply(context);
    }),
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
export const resolveActionDataThunk = cachedComputed(function resolveActionDataThunk<T>(
  thunk: ActionDataThunk<T>,
  context: ActionContext
): T {
  if (typeof thunk === "function") {
    return (thunk as ActionContextCallback<T>)(context);
  }

  return thunk;
});
