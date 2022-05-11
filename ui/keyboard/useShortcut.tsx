import { useIsPresent } from "framer-motion";
import { useEffect } from "react";

import { createCleanupObject } from "@aca/shared/cleanup";
import { useDocument } from "@aca/shared/context/window";

import {
  ShortcutCallback,
  ShortcutDefinition,
  ShortcutOptions,
  createShortcutListener,
  initializeDocumentShortcuts,
  resolveShortcutsDefinition,
} from "./shortcutBase";

function useInitializeDocumentShortcuts() {
  const document = useDocument();

  useEffect(() => {
    if (document) {
      initializeDocumentShortcuts(document);
    }
  }, [document]);
}

export function useOptionalShortcut(
  shortcut?: ShortcutDefinition,
  callback?: ShortcutCallback,
  options?: ShortcutOptions
) {
  useInitializeDocumentShortcuts();
  const keys = shortcut ? resolveShortcutsDefinition(shortcut) : null;

  useEffect(() => {
    if (!callback) return;
    if (!keys) return;

    return createShortcutListener(keys, { callback, options });
  }, [keys, callback, options]);
}

export function useShortcut(shortcut: ShortcutDefinition, callback?: ShortcutCallback, options?: ShortcutOptions) {
  useInitializeDocumentShortcuts();
  const isPresent = useIsPresent();
  const keys = resolveShortcutsDefinition(shortcut);

  useEffect(() => {
    if (!isPresent) return;
    if (!callback) return;

    return createShortcutListener(keys, { callback, options });
  }, [keys, callback, options, isPresent]);
}

export function useShortcuts(shortcuts: ShortcutDefinition[], callback?: ShortcutCallback, options?: ShortcutOptions) {
  useInitializeDocumentShortcuts();
  const isPresent = useIsPresent();
  useEffect(() => {
    if (!isPresent) return;
    if (!callback) return;

    const cleanup = createCleanupObject();

    shortcuts.forEach((shortcut) => {
      const keys = resolveShortcutsDefinition(shortcut);

      cleanup.enqueue(createShortcutListener(keys, { callback, options }));
    });

    return cleanup.clean;
  }, [shortcuts, callback, options, isPresent]);
}
