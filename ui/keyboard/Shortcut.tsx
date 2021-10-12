import styled from "styled-components";

import { getShortcutNiceKeys } from "./describeShortcut";
import { ShortcutCallback, ShortcutDefinition, ShortcutOptions } from "./shortcutBase";
import { useShortcut } from "./useShortcut";

interface Props {
  shortcut: ShortcutDefinition;
  callback?: ShortcutCallback;
  options?: ShortcutOptions;
}

export function Shortcut({ shortcut, callback, options }: Props) {
  useShortcut(shortcut, callback, options);

  const niceShortcutKeys = getShortcutNiceKeys(shortcut);

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
