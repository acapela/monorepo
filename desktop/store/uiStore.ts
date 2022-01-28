import { makeAutoObservable } from "mobx";

import { desktopRouter } from "@aca/desktop/routes";

/**
 * Store holding global state of the UI
 */
export const uiStore = makeAutoObservable({
  isSidebarOpened: false,
});

/**
 * After each route change, make sure sidebar is closed.
 */
desktopRouter.subscribe(() => {
  uiStore.isSidebarOpened = false;
});
