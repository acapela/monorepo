import { HotKey, compareHotkey, parseHotkey } from "is-hotkey";
import { sortBy } from "lodash";

import { convertMaybeArrayToArray, removeElementFromArray } from "~shared/array";
import { onDocumentReady } from "~shared/document";
import { mapGetOrCreate } from "~shared/map";

import { Key } from "./codes";

export type ShortcutDefinition = Key | Key[];

export type ShortcutKeys = Key[];

export interface ShortcutOptions {
  isEnabled?: boolean;
  /**
   * This flag indicates that shortcut will not be fired if there is any other shortcut (without this flag) running for
   * the same keyboard shortcut.
   */
  ignoreIfAlreadyDefined?: boolean;
}

export type ShortcutCallback = (event: KeyboardEvent) => void | boolean;

/**
 * This will create 'normalized' definition of a shortcut. It is to be able to compare 2 shortcuts defined differently
 * that mean the same things eg:
 *
 * ['Shift', 'A'] and ['A', 'Shift']
 *
 * ^ if we just do .join('+'), the two above would return different string, while they mean exactly the same shortcut.
 */
function getShortcutDescription(keys: ShortcutKeys) {
  return sortBy(keys).join("+").toLowerCase();
}

export function resolveShortcutsDefinition(shortcut: ShortcutDefinition): ShortcutKeys {
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
 * body.addEventListener('click', () => console.info('a'));
 * body.addEventListener('click', () => console.info('b'));
 *
 * // Click!
 * // Output in the console: a, b
 *
 * With shortcuts we want it in reverse order - who is last to add shortcut is the first to handle it (and potentially prevent propagation to other handlers).
 *
 * useShortcut('Enter', () => {
 *   console.info('foo')
 * });
 *
 * useShortcut('Enter', () => {
 *   // !!! I'll be first to handle this event. If I'll return true (handled) no other handler will be called!
 * });
 */
const shortcutHandlersMap = new Map<string, { hotKey: HotKey; callbacks: RunningShortcutInfo[] }>();

interface RunningShortcutInfo {
  callback: ShortcutCallback;
  options?: ShortcutOptions;
}

/**
 * Let's create only one 'master' keyboard handler to compare keyboard events with each registered shortcuts.
 */
onDocumentReady(() => {
  document.body.addEventListener(
    "keydown",
    (event) => {
      for (const [, { hotKey, callbacks }] of shortcutHandlersMap.entries()) {
        if (!compareHotkey(hotKey, event)) {
          continue;
        }

        const hasAlwaysRunningCallback = callbacks.some((callbackInfo) => {
          if (!callbackInfo.options) return true;
          if (callbackInfo.options.isEnabled === false) return false;
          if (callbackInfo.options.ignoreIfAlreadyDefined) return false;

          return true;
        });

        for (const callbackInfo of callbacks) {
          if (callbackInfo.options?.isEnabled === false) {
            continue;
          }

          // If some of the handlers already returned true, don't allow other handlers to be called.
          if (finallyHandledEvents.has(event)) {
            break;
          }

          if (callbackInfo.options?.ignoreIfAlreadyDefined && hasAlwaysRunningCallback) {
            continue;
          }

          const callbackResult = callbackInfo.callback(event);

          // Handled returned true - prevent propagation of event and other shortcut handlers to be called.
          if (callbackResult === true) {
            event.stopPropagation();
            event.preventDefault();
            finallyHandledEvents.add(event);
          }
        }
      }
    },
    { capture: true }
  );
});

export function createShortcutListener(keys: ShortcutKeys, info: RunningShortcutInfo) {
  const shortcut = getShortcutDescription(keys);

  const shortcutHandlers = mapGetOrCreate(shortcutHandlersMap, shortcut, () => ({
    hotKey: parseHotkey(shortcut, { byKey: true }),
    callbacks: [],
  }));

  /**
   * Important!
   *
   * We add new callbacks AT START of handlers list (unshift), not at the end (push!).
   *
   * This is because we want new handlers to be called first instead of default DOM behavior!
   */
  shortcutHandlers.callbacks.unshift(info);

  return () => {
    removeElementFromArray(shortcutHandlers.callbacks, info);
  };
}
