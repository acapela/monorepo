import { useEffect } from "react";

import { convertMaybeArrayToArray } from "~shared/array";
import { createCleanupObject } from "~shared/cleanup";

import { describeShortcut } from "./describeShortcut";
import {
  ShortcutCallback,
  ShortcutDefinition,
  ShortcutKeys,
  ShortcutOptions,
  createShortcutListener,
  resolveShortcutsDefinition,
} from "./shortcutBase";

console.log({ resolveShortcutsDefinition });

export function useShortcut(shortcut: ShortcutDefinition, callback?: ShortcutCallback, options?: ShortcutOptions) {
  const keys = resolveShortcutsDefinition(shortcut);

  useEffect(() => {
    if (!callback) return;

    return createShortcutListener(keys, { callback, options });
  }, [keys, callback, options]);

  return describeShortcut(shortcut);
}

export function useShortcuts(shortcuts: ShortcutDefinition[], callback?: ShortcutCallback, options?: ShortcutOptions) {
  useEffect(() => {
    if (!callback) return;

    const cleanup = createCleanupObject();

    shortcuts.forEach((shortcut) => {
      const keys = resolveShortcutsDefinition(shortcut);

      cleanup.enqueue(createShortcutListener(keys, { callback, options }));
    });

    return cleanup.clean;
  }, [shortcuts, callback, options]);
}
