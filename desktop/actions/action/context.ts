import assert from "assert";

import { uniq } from "lodash";
import { makeObservable, observable } from "mobx";
import { useMemo } from "react";

import { cachedComputed } from "@aca/clientdb";
import { getNullableDb } from "@aca/desktop/clientdb";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { desktopRouter } from "@aca/desktop/routes";
import { focusSessionStore } from "@aca/desktop/store/focus";
import { uiStore } from "@aca/desktop/store/ui";
import { deepMemoize } from "@aca/shared/deepMap";
import { useEqualRef } from "@aca/shared/hooks/useEqualRef";
import { runUntracked } from "@aca/shared/mobx/utils";
import { isNotNullish } from "@aca/shared/nullish";

import { createActionTargetPredicates } from "./targets";
import { ActionView } from "./view";

export type ActionContextCallback<T> = (context: ActionContext) => T;

export type ActionDataThunk<T> = T | ActionContextCallback<T>;

const routeTargets = cachedComputed(function routeTargets(): unknown[] {
  const focusRoute = desktopRouter.getRouteParamsIfActive("focus");

  const db = getNullableDb();

  if (focusRoute) {
    if (!db) return [];
    const { notificationId, listId } = focusRoute;
    return [db.notification.findById(notificationId), getInboxListsById(listId)];
  }

  const listRoute = desktopRouter.getRouteParamsIfActive("list");

  if (listRoute) {
    const { listId } = listRoute as unknown as { listId: string };

    return [getInboxListsById(listId)];
  }

  return [];
});

interface ActionContextConfig {
  isContextual?: boolean;
  searchPlaceholder?: string;
  initialSearchValue?: string;
  hideTarget?: boolean;
}

export function getImplicitTargets() {
  return [focusSessionStore.session?.activeNotification, uiStore.focusedTarget, ...routeTargets()].filter(isNotNullish);
}

function convertTargetOrTargetsToArray(targetOrTargets: unknown): unknown[] {
  if (Array.isArray(targetOrTargets)) {
    return targetOrTargets;
  }

  return [targetOrTargets];
}

function createActionContextWithTargetGetter(targetsGetter: () => unknown[], options?: ActionContextConfig) {
  const {
    isContextual = false,
    searchPlaceholder = "Find anything...",
    initialSearchValue = "",
    hideTarget = false,
  } = options ?? {};

  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(targetsGetter);

  const context = makeObservable(
    {
      options,
      searchPlaceholder,
      hideTarget,
      isContextual,
      // Not really used, but makes it easier to debug actions
      get target() {
        return targetsGetter();
      },
      view<D>(view: ActionView<D>): D {
        return view.getView(context);
      },
      searchKeyword: initialSearchValue,
      assertView<D>(view: ActionView<D>) {
        const foundView = context.view(view);

        assert(foundView, "No view");

        return foundView as NonNullable<D>;
      },
      hasView(view: ActionView<unknown>) {
        return !!context.view(view);
      },
      ...targetPredicates,
    },
    { searchKeyword: observable }
  );

  return context;
}

export const createActionContext = deepMemoize(function createActionContext(
  forcedTargetOrTargets?: unknown,
  options?: ActionContextConfig
) {
  const forcedTargets = convertTargetOrTargetsToArray(forcedTargetOrTargets);

  return createActionContextWithTargetGetter(() => {
    const targets = uniq([...forcedTargets, ...getImplicitTargets()]).filter(isNotNullish);

    return targets;
  }, options);
});

export function getFrozenActionContext(context: ActionContext) {
  const targets = runUntracked(() => context.target.slice());

  return createActionContextWithTargetGetter(() => targets, context.options);
}

export function useActionContext(targetOrTargets?: unknown, options?: ActionContextConfig) {
  const equalOptions = useEqualRef(options);

  const context = useMemo(() => {
    return createActionContext(targetOrTargets, equalOptions);
  }, [targetOrTargets, equalOptions]);

  return context;
}

export type ActionContext = ReturnType<typeof createActionContext>;
