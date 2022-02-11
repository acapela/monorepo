import { autorun, makeAutoObservable, observable } from "mobx";

import { applicationStateBridge } from "@aca/desktop/bridge/system";
import { uiSettingsBridge } from "@aca/desktop/bridge/ui";
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
  isInDarkMode: false,
  isDisplayingZenImage: false,
  getTypedFocusedTarget<T>() {
    return uiStore.focusedTarget as T | null;
  },
  useFocus<T>(item: T, keyGetter?: (item: T | null) => string | undefined) {
    function getIsFocused() {
      if (!keyGetter) return item === uiStore.focusedTarget;

      return keyGetter(item) === keyGetter(uiStore.focusedTarget as T | null);
    }

    const isFocused = getIsFocused();

    return isFocused;
  },
  get isFullscreen() {
    return applicationStateBridge.get().isFullscreen;
  },
  // Any part of the app is focused
  get isAppFocused() {
    return applicationStateBridge.get().isFocused;
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
 * After each route change, make sure sidebar is closed and the zen image is removed.
 */
desktopRouter.subscribe(() => {
  uiStore.isSidebarOpened = false;
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

// Updates the uiStore dark mode settings depending on the stored value in the settings bridge
autorun(() => {
  const { isReady: isPersistedSettingsReady, value: persistedSettings } = uiSettingsBridge.observables;

  if (isPersistedSettingsReady.get()) {
    const isInDarkMode = persistedSettings.get().isDarkMode;

    if (typeof isInDarkMode !== "undefined") {
      uiStore.isInDarkMode = isInDarkMode;
    }
  }
});