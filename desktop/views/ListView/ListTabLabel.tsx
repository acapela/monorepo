import React from "react";
import styled from "styled-components";

import { goToList } from "@aca/desktop/actions/lists";
import { DefinedList } from "@aca/desktop/domains/list/defineList";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  list: DefinedList;
  count: number;
  isActive: boolean;
}

export function ListTabLabel({ count, isActive, list }: Props) {
  return (
    <ActionTrigger action={goToList} target={list}>
      <UIHolder>
        <UILabel>{list.name}</UILabel>
        <UICount>{count}</UICount>
        <UIActiveIndicator $isVisible={isActive} />
      </UIHolder>
    </ActionTrigger>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 8px;
  ${theme.typo.secondaryTitle}
  ${theme.common.clickable};
  position: relative;
`;

const UILabel = styled.div`
  ${theme.font.medium};
`;

const UICount = styled.div`
  ${theme.font.opacity(0.5)};
`;

const UIActiveIndicator = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  height: 2px;
  ${theme.colors.layout.divider.asBg};
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transition: 0.15s all;
`;
