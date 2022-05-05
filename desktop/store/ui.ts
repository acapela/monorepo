import { action, autorun, computed, makeAutoObservable, observable, runInAction } from "mobx";

import { applicationStateBridge } from "@aca/desktop/bridge/system";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { routeChangeAtom } from "@aca/desktop/routes";
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

createWindowEvent(
  "focus",
  action(() => {
    hasDirectFocus.set(true);
  })
);

createWindowEvent(
  "mousemove",
  action(() => {
    hasDirectFocus.set(true);
  })
);

createWindowEvent(
  "blur",
  action(() => {
    hasDirectFocus.set(false);
  })
);

/**
 * Store holding global state of the UI
 */
export const uiStore = makeAutoObservable({
  focusedTarget: null as unknown,
  activeListId: null as string | null,
  activeNotification: null as NotificationEntity | null,
  isSidebarOpened: true,
  isInDarkMode: false,
  isDisplayingZenImage: false,
  isShowingPeekView: false,
  getTypedFocusedTarget<T>() {
    return uiStore.focusedTarget as T | null;
  },
  useFocus<T>(item: T, keyGetter?: (item: T | null) => string | undefined) {
    const isFocusedComputed = computed(function getIsFocused() {
      if (!keyGetter) return item === uiStore.focusedTarget;

      return keyGetter(item) === keyGetter(uiStore.focusedTarget as T | null);
    });

    const isFocused = isFocusedComputed.get();

    return isFocused;
  },
  get isFullscreen() {
    return applicationStateBridge.get().isFullscreen;
  },
  // Any part of the app is focused
  get isAppFocused() {
    return applicationStateBridge.value.isFocused;
  },
  get isAnyPreviewFocused(): boolean {
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
 * After each route change, make sure sidebar is closed and the zen image is removed.
 */
autorun(() => {
  routeChangeAtom.reportObserved();
  uiStore.focusedTarget = null;
  uiStore.isDisplayingZenImage = false;
});

autorun(() => {
  if (uiStore.isFullscreen) {
    document.body.classList.add("fullscreen");
  } else {
    document.body.classList.remove("fullscreen");
  }
});

autorun(() => {
  if (uiStore.isAnyPreviewFocused) {
    document.body.classList.add("embed-focused");
  } else {
    document.body.classList.remove("embed-focused");
  }
});

// Updates the uiStore dark mode settings depending on the stored value in the settings bridge
const preferDarkMediaQuery = "(prefers-color-scheme: dark)";
const isSystemDarkBox = observable.box(window.matchMedia(preferDarkMediaQuery).matches);
window.matchMedia(preferDarkMediaQuery).addEventListener("change", (event) => {
  isSystemDarkBox.set(event.matches);
});

autorun(() => {
  const {
    value: { theme },
  } = uiSettingsBridge;

  const isInDarkMode = theme == "dark" || (theme == "auto" && isSystemDarkBox.get());
  runInAction(() => {
    uiStore.isInDarkMode = isInDarkMode;
  });
});
