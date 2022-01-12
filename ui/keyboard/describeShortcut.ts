import { isMac } from "@aca/frontend/src/utils/platformDetection";

import { Key } from "./codes";
import { ShortcutDefinition, resolveShortcutsDefinition } from "./shortcutBase";

type KeyboardPlatform = "mac" | "windows";

type KeyNiceVersion = string | Partial<Record<KeyboardPlatform, string>>;

/**
 * Map describing 'UI' version of shortcut keys for proper platform.
 *
 * It is useful with showing UI hints for shortcuts.
 */
const shortcutKeyNiceVersionMap: Partial<Record<Key, KeyNiceVersion>> = {
  Mod: { mac: "⌘", windows: "CTRL" },
  Alt: { mac: "⌥", windows: "ALT" },
  Enter: "↩︎",
  Shift: "⇧",
  Control: "CTRL",
  Backspace: "⌫",
  Up: "↑",
  Down: "↓",
  Left: "←",
  Right: "→",
  ArrowUp: "↑",
  ArrowDown: "↓",
  ArrowLeft: "←",
  ArrowRight: "→",
  Delete: "⌦",
  Tab: "⇥",
};

export function getShortcutKeyNiceVersion(key: Key) {
  const alternativeInfo = shortcutKeyNiceVersionMap[key];

  if (!alternativeInfo) return key;

  if (typeof alternativeInfo === "string") return alternativeInfo;

  const platform: KeyboardPlatform = isMac() ? "mac" : "windows";

  return alternativeInfo[platform] ?? key;
}

export function getShortcutNiceKeys(shortcut: ShortcutDefinition): string[] {
  const shortcutKeys = resolveShortcutsDefinition(shortcut);

  const niceShortcutKeys = shortcutKeys.map(getShortcutKeyNiceVersion);

  return niceShortcutKeys;
}

export function describeShortcut(shortcutDefinition: ShortcutDefinition) {
  const niceKeys = getShortcutNiceKeys(shortcutDefinition);

  return niceKeys.join(" + ");
}
