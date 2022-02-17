import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { goToList } from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { theme } from "@aca/ui/theme";

interface Props {
  list: NotificationsList;
  className?: string;
}

export const ListLabel = observer(function ListTabLabel({ list, className }: Props) {
  return (
    <UIHolder action={goToList} target={list} className={className}>
      <UILabel>{list.name}</UILabel>
      <UICount>{list.getAllNotifications().length}</UICount>
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
  ${theme.typo.content.medium}
  ${theme.common.clickable};
  ${theme.common.ellipsisText}
  position: relative;
`;

const UICount = styled.div`
  ${theme.font.opacity(0.5)};
`;
