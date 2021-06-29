import { convertMaybeArrayToArray } from "~shared/array";
import { Key } from "./codes";
import isHotkey from "is-hotkey";
import { useEffect } from "react";
import { createElementEvent } from "~shared/domEvents";
import { createCleanupObject } from "~shared/cleanup";

type ShortcutDefinition = Key | Key[];

type ShortcutKeys = Key[];

interface ShortcutHookOptions {
  isEnabled?: boolean;
}

type ShortcutCallback = (event: KeyboardEvent) => void;

function resolveShortcutsDefinition(shortcut: ShortcutDefinition): ShortcutKeys {
  return convertMaybeArrayToArray(shortcut);
}

function createShortcutListener(keys: ShortcutKeys, callback: ShortcutCallback) {
  return createElementEvent(
    document.body,
    "keydown",
    (event) => {
      if (!isHotkey(keys.join("+"), event)) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      callback?.(event);
    },
    { capture: true }
  );
}

export function useShortcut(shortcut: ShortcutDefinition, callback?: ShortcutCallback, options?: ShortcutHookOptions) {
  const keys = resolveShortcutsDefinition(shortcut);

  useEffect(() => {
    if (options?.isEnabled === false) return;
    if (!callback) return;
    return createShortcutListener(keys, callback);
  }, [keys, callback, options?.isEnabled]);
}

export function useShortcuts(
  shortcuts: ShortcutDefinition[],
  callback?: ShortcutCallback,
  options?: ShortcutHookOptions
) {
  useEffect(() => {
    if (!callback) return;
    if (options?.isEnabled === false) return;

    const cleanup = createCleanupObject();

    shortcuts.forEach((shortcut) => {
      const keys = resolveShortcutsDefinition(shortcut);

      cleanup.enqueue(createShortcutListener(keys, callback));
    });

    return cleanup.clean;
  }, [shortcuts, callback, options?.isEnabled]);
}
