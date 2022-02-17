import { isEqual } from "lodash";
import { observer, useObserver } from "mobx-react";

import { globalShortcutPressed, registerGlobalShortcutRequest } from "@aca/desktop/bridge/globalShortcuts";
import { applicationWideSettingsBridge, showMainWindowRequest } from "@aca/desktop/bridge/system";
import { uiStore } from "@aca/desktop/store/ui";
import { createCleanupObject } from "@aca/shared/cleanup";
import { useEqualEffect } from "@aca/shared/hooks/useEqualEffect";
import { ShortcutKeys } from "@aca/ui/keyboard/shortcutBase";

function useGlobalShortcut(keys: ShortcutKeys | null, handler: () => void) {
  const isMainWindowActive = useObserver(() => uiStore.isAppFocused);
  useEqualEffect(() => {
    if (isMainWindowActive) return;
    if (!keys) return;
    const cleanup = createCleanupObject();
    cleanup.next = registerGlobalShortcutRequest({ shortcut: keys });

    cleanup.next = globalShortcutPressed.subscribe(({ shortcut }) => {
      if (!isEqual(shortcut, keys)) return;

      handler();
    });

    return cleanup.clean;
  }, [keys, isMainWindowActive]);
}

export const GlobalShortcutsManager = observer(() => {
  const settings = applicationWideSettingsBridge.get();

  useGlobalShortcut(settings.globalShowAppShortcut, () => {
    showMainWindowRequest();
  });

  useGlobalShortcut(settings.globalPeekShortcut, () => {
    uiStore.isShowingPeekView = true;
  });

  return null;
});
