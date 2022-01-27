import { makeAutoObservable } from "mobx";

import { desktopRouter } from "@aca/desktop/routes";

export const appStateStore = makeAutoObservable({
  isSidebarOpened: false,
});

desktopRouter.subscribe(() => {
  appStateStore.isSidebarOpened = false;
});
