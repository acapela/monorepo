import { ShortcutKey } from "./codes";
import { useShortcuts } from "./useShortcut";

const ALPHANUMERIC_CHARS = "abcdefghijklmnoprstuwxyz0123456789";

const shortcuts = ALPHANUMERIC_CHARS.split("") as ShortcutKey[];

interface Options {
  isEnabled?: boolean;
}

type AlphanumericShortcutCallback = (event: KeyboardEvent, caseAwareInput: string) => void | boolean;

export function useAlphanumericShortcut(callback: AlphanumericShortcutCallback, options?: Options) {
  useShortcuts(
    shortcuts,
    (event) => {
      return callback(event, event.key);
    },
    { ignoreIfAlreadyDefined: true, isEnabled: options?.isEnabled }
  );

  useShortcuts(
    shortcuts.map((key): ShortcutKey[] => ["Shift", key]),
    (event) => {
      return callback(event, event.key);
    },
    { ignoreIfAlreadyDefined: true, isEnabled: options?.isEnabled }
  );
}
