import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { createNotificationList } from "@aca/desktop/actions/lists";
import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { FeedbackButton } from "@aca/desktop/domains/feedbackWidget/FeedbackButton";
import {
  allNotificationsList,
  getInboxLists,
  outOfInboxLists,
  savedNotificationsList,
} from "@aca/desktop/domains/list/all";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { systemBarPlaceholder } from "@aca/desktop/ui/systemTopBar/ui";
import { groupByFilter } from "@aca/shared/groupByFilter";
import { useDoubleClick } from "@aca/shared/hooks/useDoubleClick";
import { theme } from "@aca/ui/theme";

import { SidebarListsGroup } from "./ListsGroup";

export const SIDEBAR_WIDTH = 270;

export const sidebarShowTransition = css`
  transition: 0.3s all;
`;

interface Props {
  isOpened: boolean;
}

export const Sidebar = observer(({ isOpened }: Props) => {
  const sideBarRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);

  useDoubleClick(draggerRef, () => {
    toggleMaximizeRequest();
  });

  const allInboxLists = getInboxLists();

  const [systemInboxLists, nonSystemInboxLists] = groupByFilter(allInboxLists, (list) => {
    if (list.id === allNotificationsList.id) return true;
    if (list.id === savedNotificationsList.id) return true;
    if (list.listEntity?.system_id) return true;

    return false;
  });

  const [customInboxLists, integrationInboxLists] = groupByFilter(nonSystemInboxLists, (list) => {
    return !!list.listEntity;
  });

  return (
    <UIHolder ref={sideBarRef} $isOpened={isOpened}>
      <UIWindowDragger ref={draggerRef}>
        <TopBarActionButton action={createNotificationList} />
      </UIWindowDragger>
      <UIItems>
        <UIItemGroup>
          <SidebarListsGroup lists={systemInboxLists} />
        </UIItemGroup>
        {customInboxLists.length > 0 && (
          <UIItemGroup>
            <SidebarListsGroup lists={customInboxLists} />
          </UIItemGroup>
        )}

        <UIItemGroup>
          <SidebarListsGroup lists={integrationInboxLists} />
        </UIItemGroup>

        <UIItemGroup>
          <SidebarListsGroup lists={outOfInboxLists} />
        </UIItemGroup>
      </UIItems>
      <UIFixedButton>
        <FeedbackButton />
      </UIFixedButton>
    </UIHolder>
  );
});

const UIHolder = styled.div<{ $isOpened: boolean }>`
  width: ${SIDEBAR_WIDTH}px;
  flex-grow: 1;
  ${theme.shadow.popover};
  ${theme.radius.panel};
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${sidebarShowTransition};
`;

const UIItemGroup = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UIItems = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 12px;
  padding-right: 12px;
  padding-top: 16px;
  row-gap: 16px;
  flex-grow: 1;
`;

const UIWindowDragger = styled.div`
  ${systemBarPlaceholder};
  ${theme.common.dragWindow};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 16px;
`;

const UIFixedButton = styled.div`
  position: fixed;
  bottom: 16px;
  left: 16px;
`;
