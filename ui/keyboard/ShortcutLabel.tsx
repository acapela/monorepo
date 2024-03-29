import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

import { getShortcutNiceKeys } from "./describeShortcut";
import { ShortcutDefinition } from "./shortcutBase";

interface Props {
  shortcut: ShortcutDefinition;
  className?: string;
}

export const ShortcutDescriptor = styled(function ShortcutDescriptor({ shortcut, className }: Props) {
  const niceShortcutKeys = getShortcutNiceKeys(shortcut);

  return (
    <UIHolder className={className}>
      {niceShortcutKeys.map((key) => {
        return (
          <UIKey key={key} className="key">
            {key}
          </UIKey>
        );
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  user-select: none;
  gap: 2px;
  line-height: 1;
  ${theme.typo.noteTitle.secondary};
`;

const UIKey = styled.div`
  line-height: 1;
  text-align: center;
`;
