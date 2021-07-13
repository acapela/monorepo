import { convertMaybeArrayToArray, removeElementFromArray } from "~shared/array";
import { Key } from "./codes";
import isHotkey from "is-hotkey";
import { useEffect } from "react";
import { createCleanupObject } from "~shared/cleanup";
import { onDocumentReady } from "~shared/document";
import { mapGetOrCreate } from "~shared/map";

type ShortcutDefinition = Key | Key[];

type ShortcutKeys = Key[];

interface ShortcutHookOptions {
  isEnabled?: boolean;
}

type ShortcutCallback = (event: KeyboardEvent) => void | boolean;

function resolveShortcutsDefinition(shortcut: ShortcutDefinition): ShortcutKeys {
  return convertMaybeArrayToArray(shortcut);
}

/**
 * If any handler return true, we don't want any other handler to be able to be called.
 *
 * This list will keep track of events for which some shortcut callback has returned true.
 */
const finallyHandledEvents = new WeakSet<KeyboardEvent>();

/**
 * We'll manually keep list of all shortcuts handlers instead of adding event listener for each one.
 *
 * This is because of the reason how DOM is ordering events execution:
 *
 * By default in DOM - who is first to add listener is first to be called
 *
 * eg
 * body.addEventListener('click', () => console.log('a'));
 * body.addEventListener('click', () => console.log('b'));
 *
 * // Click!
 * // Output in the console: a, b
 *
 * With shortcuts we want it in reverse order - who is last to add shortcut is the first to handle it (and potentially prevent propagation to other handlers).
 *
 * useShortcut('Enter', () => {
 *   console.log('foo')
 * });
 *
 * useShortcut('Enter', () => {
 *   // !!! I'll be first to handle this event. If I'll return true (handled) no other handler will be called!
 * });
 */
const shortcutHandlersMap = new Map<string, ShortcutCallback[]>();

/**
 * Let's create only one 'master' keyboard handler to compare keyboard events with each registered shortcuts.
 */
onDocumentReady(() => {
  document.body.addEventListener(
    "keydown",
    (event) => {
      shortcutHandlersMap.forEach((callbacks, shortcut) => {
        if (!isHotkey(shortcut, event)) {
          return;
        }

        for (const callback of callbacks) {
          // If some of the handlers already returned true, don't allow other handlers to be called.
          if (finallyHandledEvents.has(event)) {
            return;
          }

          const callbackResult = callback?.(event);

          // Handled returned true - prevent propagation of event and other shortcut handlers to be called.
          if (callbackResult === true) {
            event.stopPropagation();
            event.preventDefault();
            finallyHandledEvents.add(event);
          }
        }
      });
    },
    { capture: true }
  );
});

function createShortcutListener(keys: ShortcutKeys, callback: ShortcutCallback) {
  const shortcut = keys.join("+");

  const shortcutHandlers = mapGetOrCreate(shortcutHandlersMap, shortcut, () => []);

  /**
   * Important!
   *
   * We add new callbacks AT START of handlers list (unshift), not at the end (push!).
   *
   * This is because we want new handlers to be called first instead of default DOM behavior!
   */
  shortcutHandlers.unshift(callback);

  return () => {
    removeElementFromArray(shortcutHandlers, callback);
  };
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
