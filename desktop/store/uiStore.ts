import { makeAutoObservable, observable } from "mobx";

import { appWindowValue } from "@aca/desktop/bridge/appWindow";
import { desktopRouter } from "@aca/desktop/routes";
import { createWindowEvent } from "@aca/shared/domEvents";

/**
 * Note on focus:
 *
 * window 'focus' might be a bit unintuitive in our context. We're having 'embed' browser views as
 * part of our main window. Those 'views' are separate 'windows', yet, part ouf our 'main window'.
 *
 * This there are 2 kind of 'focus'.
 *
 * App focus: either main client widow or one of its views is focused
 * Client focus: our 'react app' has direct 'dom' focus.
 */

const hasDirectFocus = observable.box(true);

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
  // Any part of the app is focused
  get isAppFocused() {
    return appWindowValue.get().isFocused;
  },
  get isAnyPreviewFocused() {
    // If 'client' is directly focused, there is no way some preview is
    if (hasDirectFocus.get()) return false;

    // 'client' is not directly focused. Thus if app is focused - it must be some preview
    return uiStore.isAppFocused;
  },
  // Main 'client' part is focused
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
