import { cachedComputed } from "@aca/clientdb";
import { getDb } from "@aca/desktop/clientdb";
import { getPredefinedListById } from "@aca/desktop/domains/list/preconfigured";
import { getRouteParamsIfActive } from "@aca/desktop/routes";
import { uiStore } from "@aca/desktop/store/uiStore";
import { isNotNullish } from "@aca/shared/nullish";

import { createActionTargetPredicates } from "./targets";

const routeTargets = cachedComputed((): unknown[] => {
  const focusRoute = getRouteParamsIfActive("focus");

  if (focusRoute) {
    const { notificationId, listId } = focusRoute;
    return [getDb().notification.findById(notificationId), getPredefinedListById(listId)];
  }

  const listRoute = getRouteParamsIfActive("list");

  if (listRoute) {
    const { listId } = listRoute;

    return [getPredefinedListById(listId)];
  }

  return [];
});

export function createActionContext(forcedTarget?: unknown) {
  // TODO: handle forced target as array
  const targetPredicates = createActionTargetPredicates(() => {
    const targets = [forcedTarget, uiStore.focusedTarget, ...routeTargets()].filter(isNotNullish);

    return targets;
  });

  return {
    // Not really used, but makes it easier to debug actions
    forcedTarget,
    ...targetPredicates,
  };
}

export type ActionContext = ReturnType<typeof createActionContext>;
