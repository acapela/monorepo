import assert from "assert";

import { makeObservable, observable } from "mobx";
import { useMemo } from "react";

import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { getRouteParamsIfActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/ui";
import { deepMemoize } from "@aca/shared/deepMap";
import { useEqualRef } from "@aca/shared/hooks/useEqualRef";
import { isNotNullish } from "@aca/shared/nullish";

import { createActionTargetPredicates } from "./targets";
import { ActionView } from "./view";

export type ActionContextCallback<T> = (context: ActionContext) => T;

export type ActionDataThunk<T> = T | ActionContextCallback<T>;

const routeTargets = cachedComputed(function routeTargets(): unknown[] {
  const focusRoute = getRouteParamsIfActive("focus");

  if (focusRoute) {
    const { notificationId, listId } = focusRoute;
    return [getDb().notification.findById(notificationId), getInboxListsById(listId)];
  }

  const listRoute = getRouteParamsIfActive("list");

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
  return [uiStore.focusedTarget, ...routeTargets()].filter(isNotNullish);
}

export const createActionContext = deepMemoize(function createActionContext(
  forcedTarget?: unknown,
  options?: ActionContextConfig
) {
  const {
    isContextual = false,
    searchPlaceholder = "Find anything...",
    initialSearchValue = "",
    hideTarget = false,
  } = options ?? {};
  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(() => {
    const targets = [forcedTarget, ...getImplicitTargets()].filter(isNotNullish);

    return targets;
  });

  const context = makeObservable(
    {
      searchPlaceholder,
      hideTarget,
      isContextual,
      // Not really used, but makes it easier to debug actions
      forcedTarget,
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
});

export function useActionContext(forcedTarget?: unknown, options?: ActionContextConfig) {
  const equalOptions = useEqualRef(options);

  const context = useMemo(() => {
    return createActionContext(forcedTarget, equalOptions);
  }, [forcedTarget, equalOptions]);

  return context;
}

export type ActionContext = ReturnType<typeof createActionContext>;
