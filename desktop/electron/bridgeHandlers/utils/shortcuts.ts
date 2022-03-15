import { ShortcutDefinition, resolveShortcutsDefinition } from "@aca/ui/keyboard/shortcutBase";

const aliases: Record<string, string> = {
  meta: "CommandOrControl",
  mod: "CommandOrControl",
};

export function convertShortcutKeysToElectronShortcut(shortcut: ShortcutDefinition) {
  return resolveShortcutsDefinition(shortcut)
    .map((key) => {
      return aliases[key.toLowerCase()] ?? key;
    })
    .join("+");
}
