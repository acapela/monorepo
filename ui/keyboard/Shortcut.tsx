import styled from "styled-components";

import { Key } from "./codes";
import { ShortcutCallback, ShortcutDefinition, ShortcutOptions, resolveShortcutsDefinition } from "./shortcutBase";
import { useShortcut } from "./useShortcut";

interface Props {
  shortcut: ShortcutDefinition;
  callback?: ShortcutCallback;
  options?: ShortcutOptions;
}

type Platform = "mac" | "windows";

type KeyNiceVersion = string | Partial<Record<Platform, string>>;

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

function getShortcutKeyNiceVersion(key: Key) {
  const alternativeInfo = shortcutKeyNiceVersionMap[key];

  if (!alternativeInfo) return key;

  if (typeof alternativeInfo === "string") return alternativeInfo;

  const platform = getPlatform();

  return alternativeInfo[platform] ?? key;
}

function getPlatform(): Platform {
  // On server side we have to guess.
  if (typeof navigator === "undefined") return "mac";

  if (!navigator.platform) return "mac";

  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

  if (isMac) return "mac";

  return "windows";
}

export function Shortcut({ shortcut, callback, options }: Props) {
  useShortcut(shortcut, callback, options);

  const shortcutKeys = resolveShortcutsDefinition(shortcut);

  const niceShortcutKeys = shortcutKeys.map(getShortcutKeyNiceVersion);

  return (
    <UIHolder>
      {niceShortcutKeys.map((key) => {
        return <UIKey key={key}>{key}</UIKey>;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  gap: 2px;
`;
const UIKey = styled.div``;
