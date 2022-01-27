import { makeAutoObservable } from "mobx";

import { desktopRouter } from "@aca/desktop/routes";

export const appStateStore = makeAutoObservable({
  isSidebarOpened: false,
});

/**
 * After each route change, make sure sidebar is closed.
 */
desktopRouter.subscribe(() => {
  appStateStore.isSidebarOpened = false;
});
