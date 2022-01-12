import styled, { css } from "styled-components";

import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

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

  ${phone(
    css`
      display: none;
    `
  )}
`;
const UIKey = styled.div`
  ${theme.typo.content.secondary};
`;
