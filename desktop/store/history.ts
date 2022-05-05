import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

import { desktopRouter, getRouteParamsIfActive } from "../routes";

export const historyStore = createMobxPersistedStore("history", {
  lastOpenedListId: null as string | null,
});

let isFirstRouteChange = true;

desktopRouter.subscribe(() => {
  if (isFirstRouteChange) {
    isFirstRouteChange = false;
    return;
  }
  const listId = getRouteParamsIfActive("list")?.listId;

  historyStore.lastOpenedListId = listId ?? null;
});
