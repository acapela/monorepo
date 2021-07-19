import { Key } from "./codes";
import { useShortcuts } from "./useShortcut";

const ALPHANUMERIC_CHARS = "abcdefghijklmnoprstuwxyz0123456789";

const shortcuts = ALPHANUMERIC_CHARS.split("") as Key[];

interface Options {
  isEnabled?: boolean;
}

type AlphanumericShortcutCallback = (event: KeyboardEvent, caseAwareInput: string) => void | boolean;

export function useAlphanumericShortcut(callback: AlphanumericShortcutCallback, options?: Options) {
  useShortcuts(
    shortcuts,
    (event) => {
      callback(event, event.key);
    },
    { ignoreIfAlreadyDefined: true, isEnabled: options?.isEnabled }
  );

  useShortcuts(
    shortcuts.map((key): Key[] => ["Shift", key]),
    (event) => {
      callback(event, event.key);
    },
    { ignoreIfAlreadyDefined: true, isEnabled: options?.isEnabled }
  );
}
