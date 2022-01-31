import { makeAutoObservable, observable } from "mobx";

import { appWindowValue } from "@aca/desktop/bridge/appWindow";
import { desktopRouter } from "@aca/desktop/routes";
import { createWindowEvent } from "@aca/shared/domEvents";

const hasDirectFocus = observable.box();

createWindowEvent("focus", () => {
  hasDirectFocus.set(true);
});

createWindowEvent("blur", () => {
  hasDirectFocus.set(false);
});

/**
 * Store holding global state of the UI
 */
export const uiStore = makeAutoObservable({
  focusedTarget: null as unknown,
  isSidebarOpened: false,
  get isAnyPreviewFocused() {
    if (hasDirectFocus.get()) return false;
    return appWindowValue.get().isFocused;
  },
  get hasDirectFocus() {
    return hasDirectFocus.get();
  },
});

/**
 * After each route change, make sure sidebar is closed.
 */
desktopRouter.subscribe(() => {
  uiStore.isSidebarOpened = false;
});
