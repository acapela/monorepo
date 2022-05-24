import { autorun, runInAction } from "mobx";

import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";

import { desktopRouter } from "../routes";

export const historyStore = createMobxPersistedStore("history", {
  lastOpenedListId: null as string | null,
});

let isFirstRouteChange = true;

autorun(() => {
  const listId = desktopRouter.getRouteParamsIfActive("list")?.listId;

  if (isFirstRouteChange) {
    isFirstRouteChange = false;
    return;
  }

  runInAction(() => {
    historyStore.lastOpenedListId = listId ?? null;
  });
});
