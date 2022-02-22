import { createDocumentEvent } from "@aca/shared/domEvents";
import { createResolvablePromise } from "@aca/shared/promises";

import { ShortcutKey } from "./codes";
import { ShortcutKeys, getIsShortcutDefinitionMatchingEvent } from "./shortcutBase";

interface RecordShortcutsProps {
  onNextKey: (keys: ShortcutKeys) => void;
}

export function recordShortcut({ onNextKey }: RecordShortcutsProps) {
  const keys = [] as ShortcutKeys;

  const { promise, resolve } = createResolvablePromise<ShortcutKeys | null>();

  const stopListeningForKeys = createDocumentEvent(
    "keydown",
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (getIsShortcutDefinitionMatchingEvent("Esc", event)) {
        cancel();
        return;
      }

      const key = event.key;

      keys.push(key as ShortcutKey);
      onNextKey([...keys]);
    },
    { capture: true }
  );

  const stopListeningForEnd = createDocumentEvent(
    "keyup",
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      finish();
    },
    { capture: true }
  );

  function finish() {
    stopListening();
    resolve([...keys]);
  }

  function stopListening() {
    stopListeningForKeys();
    stopListeningForEnd();
  }

  function cancel() {
    stopListening();
    resolve(null);
  }

  return [promise, cancel] as const;
}
