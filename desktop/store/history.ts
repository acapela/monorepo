import { autorun } from "mobx";

import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

import { getRouteParamsIfActive } from "../routes";

export const historyStore = createMobxPersistedStore("history", {
  lastOpenedListId: null as string | null,
});

let isFirstRouteChange = true;

autorun(() => {
  const listId = getRouteParamsIfActive("list")?.listId;

  if (isFirstRouteChange) {
    isFirstRouteChange = false;
    return;
  }

  historyStore.lastOpenedListId = listId ?? null;
});
