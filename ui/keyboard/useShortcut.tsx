import { useEffect } from "react";

import { createCleanupObject } from "@aca/shared/cleanup";

import { describeShortcut } from "./describeShortcut";
import {
  ShortcutCallback,
  ShortcutDefinition,
  ShortcutOptions,
  createShortcutListener,
  resolveShortcutsDefinition,
} from "./shortcutBase";

export function useOptionalShortcut(
  shortcut?: ShortcutDefinition,
  callback?: ShortcutCallback,
  options?: ShortcutOptions
) {
  const keys = shortcut ? resolveShortcutsDefinition(shortcut) : null;

  useEffect(() => {
    if (!callback) return;
    if (!keys) return;

    return createShortcutListener(keys, { callback, options });
  }, [keys, callback, options]);
}

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
