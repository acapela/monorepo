import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { goToList } from "@aca/desktop/actions/lists";
import { DefinedList } from "@aca/desktop/domains/list/defineList";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  list: DefinedList;
  activeListId?: string;
  className?: string;
}

export const ListTabLabel = observer(function ListTabLabel({ activeListId, list, className }: Props) {
  return (
    <UIHolder action={goToList} target={list} className={className}>
      <UILabel>{list.name}</UILabel>
      <UICount>{list.getAllNotifications().count}</UICount>
      <UIActiveIndicator $isVisible={list.id === activeListId} />
    </UIHolder>
  );
});

const UILabel = styled.div`
  ${theme.font.medium};

  opacity: 0.8;

  &:hover {
    opacity: 1;
  }
`;

const UIHolder = styled(ActionTrigger)`
  display: flex;
  gap: 8px;
  ${theme.typo.secondaryTitle}
  ${theme.common.clickable};
  position: relative;
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
