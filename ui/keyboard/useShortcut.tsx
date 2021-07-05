import { convertMaybeArrayToArray } from "~shared/array";
import { Key } from "./codes";
import isHotkey from "is-hotkey";
import { useEffect } from "react";
import { createElementEvent } from "~shared/domEvents";
import { createCleanupObject } from "~shared/cleanup";

type ShortcutDefinition = Key | Key[];

type ShortcutKeys = Key[];

/**
 * Phase of the event we want to be capturing at (https://stackoverflow.com/questions/4616694/what-is-event-bubbling-and-capturing)
 *
 * Capture means we start from the root (html) till we reach the final keyboard event target.
 *
 * Bubble means we start from the target and propagate to the root (html).
 *
 * Capture phase is run before bubble phase.
 *
 * If you want to be sure your handler is executed before anything else and can block other handlers with eg. stopPropagation, use capture phase.
 */
type EventPhase = "capture" | "bubble";

interface ShortcutHookOptions {
  isEnabled?: boolean;
  // Allows deciding at which event life phase should the handler be added.
  phase?: EventPhase;
}

type ShortcutCallback = (event: KeyboardEvent) => void;

function resolveShortcutsDefinition(shortcut: ShortcutDefinition): ShortcutKeys {
  return convertMaybeArrayToArray(shortcut);
}

function createShortcutListener(keys: ShortcutKeys, callback: ShortcutCallback, phase: EventPhase = "capture") {
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
    { capture: phase === "capture" }
  );
}

export function useShortcut(shortcut: ShortcutDefinition, callback?: ShortcutCallback, options?: ShortcutHookOptions) {
  const keys = resolveShortcutsDefinition(shortcut);

  useEffect(() => {
    if (options?.isEnabled === false) return;
    if (!callback) return;
    return createShortcutListener(keys, callback, options?.phase);
  }, [keys, callback, options?.isEnabled, options?.phase]);
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

      cleanup.enqueue(createShortcutListener(keys, callback, options?.phase));
    });

    return cleanup.clean;
  }, [shortcuts, callback, options?.isEnabled, options?.phase]);
}
