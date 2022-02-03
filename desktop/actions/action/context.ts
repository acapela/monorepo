import assert from "assert";

import { makeObservable, observable } from "mobx";

import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { getAllInboxListsById } from "@aca/desktop/domains/list/preconfigured";
import { getRouteParamsIfActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { isNotNullish } from "@aca/shared/nullish";

import { createActionTargetPredicates } from "./targets";
import { ActionView } from "./view";

export type ActionContextCallback<T> = (context: ActionContext) => T;

export type ActionDataThunk<T> = T | ActionContextCallback<T>;

const routeTargets = cachedComputed((): unknown[] => {
  const focusRoute = getRouteParamsIfActive("focus");

  if (focusRoute) {
    const { notificationId, listId } = focusRoute;
    return [getDb().notification.findById(notificationId), getAllInboxListsById(listId)];
  }

  const listRoute = getRouteParamsIfActive("list");

  if (listRoute) {
    const { listId } = listRoute;

    return [getAllInboxListsById(listId)];
  }

  return [];
});

interface ActionContextConfig {
  isContextual?: boolean;
  searchPlaceholder?: string;
}

export function getImplicitTargets() {
  return [uiStore.focusedTarget, ...routeTargets()].filter(isNotNullish);
}

export function createActionContext(
  forcedTarget?: unknown,
  { isContextual = false, searchPlaceholder = "Find anything..." }: ActionContextConfig = {}
) {
  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(() => {
    const targets = [forcedTarget, uiStore.focusedTarget, ...routeTargets()].filter(isNotNullish);

    return targets;
  });

  const context = makeObservable(
    {
      searchPlaceholder,
      isContextual,
      // Not really used, but makes it easier to debug actions
      forcedTarget,
      view<D>(view: ActionView<D>): D {
        return view.getView(context);
      },
      searchKeyword: "",
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

export type ActionContext = ReturnType<typeof createActionContext>;
