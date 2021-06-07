import { convertMaybeArrayToArray } from "~shared/array";
import { Key } from "./codes";
import isHotkey from "is-hotkey";
import { useEffect } from "react";
import { createElementEvent } from "~shared/domEvents";
import { createCleanupObject } from "~shared/cleanup";

type ShortcutDefinition = Key | Key[];

type ShortcutKeys = Key[];

function resolveShortcutsDefinition(shortcut: ShortcutDefinition): ShortcutKeys {
  return convertMaybeArrayToArray(shortcut);
}

function createShortcutListener(keys: ShortcutKeys, callback: () => void) {
  return createElementEvent(
    document.body,
    "keydown",
    (event) => {
      if (!isHotkey(keys, event)) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      callback?.();
    },
    { capture: true }
  );
}

export function useShortcut(shortcut: ShortcutDefinition, callback?: () => void) {
  const shortcuts = resolveShortcutsDefinition(shortcut);

  useEffect(() => {
    if (!callback) return;
    return createShortcutListener(shortcuts, callback);
  }, [shortcuts, callback]);
}

export function useShortcuts(shortcuts: ShortcutDefinition[], callback?: () => void) {
  useEffect(() => {
    if (!callback) return;

    const cleanup = createCleanupObject();

    shortcuts.forEach((shortcut) => {
      const keys = resolveShortcutsDefinition(shortcut);

      cleanup.enqueue(createShortcutListener(keys, callback));
    });

    return cleanup.clean;
  }, [shortcuts, callback]);
}
