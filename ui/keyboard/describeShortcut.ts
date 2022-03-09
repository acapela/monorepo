import { upperFirst } from "lodash";

import { ShortcutKey } from "./codes";
import { ShortcutDefinition, resolveShortcutsDefinition } from "./shortcutBase";

type KeyboardPlatform = "mac" | "windows";

type KeyNiceVersion = string | Partial<Record<KeyboardPlatform, string>>;

function isMac() {
  // Server side let's guess
  if (typeof navigator === "undefined") return true;

  return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
}

/**
 * Map describing 'UI' version of shortcut keys for proper platform.
 *
 * It is useful with showing UI hints for shortcuts.
 */
const shortcutKeyNiceVersionMap: Partial<Record<ShortcutKey, KeyNiceVersion>> = {
  Mod: { mac: "⌘", windows: "CTRL" },
  Alt: { mac: "⌥", windows: "ALT" },
  Meta: { mac: "⌘", windows: "CTRL" },
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
  // Tab: "⇥",
  // Space: "⎵",
};

export function getShortcutKeyNiceVersion(key: ShortcutKey) {
  const alternativeInfo = shortcutKeyNiceVersionMap[key];

  if (!alternativeInfo) return upperFirst(key);

  if (typeof alternativeInfo === "string") return upperFirst(alternativeInfo);

  const platform: KeyboardPlatform = isMac() ? "mac" : "windows";

  return upperFirst(alternativeInfo[platform] ?? key);
}

export function getShortcutNiceKeys(shortcut: ShortcutDefinition): string[] {
  const shortcutKeys = resolveShortcutsDefinition(shortcut);

  const niceShortcutKeys = shortcutKeys.map(getShortcutKeyNiceVersion);

  return niceShortcutKeys;
}

export function describeShortcut(shortcutDefinition: ShortcutDefinition) {
  const niceKeys = getShortcutNiceKeys(shortcutDefinition);

  // \xa0 = non-breakable-space
  return niceKeys.join("\xa0+\xa0");
}
