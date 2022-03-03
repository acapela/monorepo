import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled, { css } from "styled-components";

import { createNotificationList, goToList } from "@aca/desktop/actions/lists";
import { allNotificationsList, getInboxLists, outOfInboxLists } from "@aca/desktop/domains/list/all";
import { getExactIsRouteActive } from "@aca/desktop/routes";
import { SYSTEM_BAR_HEIGHT } from "@aca/desktop/ui/systemTopBar";
import { theme } from "@aca/ui/theme";

import { SidebarItem } from "./SidebarItem";

export const SIDEBAR_WIDTH = 240;

export const sidebarShowTransition = css`
  transition: 0.3s all;
`;

interface Props {
  isOpened: boolean;
}

export const Sidebar = observer(({ isOpened }: Props) => {
  const sideBarRef = useRef<HTMLDivElement | null>(null);

  return (
    <UIHolder ref={sideBarRef} $isOpened={isOpened}>
      <UIItems>
        <UIItemGroup>
          <UISidebarItem
            action={goToList}
            target={allNotificationsList}
            isActive={getExactIsRouteActive("list", { listId: "allNotifications" })}
            badgeCount={allNotificationsList.getAllNotifications().length}
          />
        </UIItemGroup>

        <UIItemGroup>
          {getInboxLists()
            .filter((list) => list.id !== allNotificationsList.id)
            .map((list) => {
              const isActive = getExactIsRouteActive("list", { listId: list.id });
              const count = list.getAllNotifications().length;
              return (
                <UISidebarItem key={list.id} action={goToList} target={list} isActive={isActive} badgeCount={count} />
              );
            })}
        </UIItemGroup>

        <UIItemGroup>
          {outOfInboxLists.map((list) => {
            const isActive = getExactIsRouteActive("list", { listId: list.id });
            const shouldShowCount = !list.dontShowCount;
            const count = shouldShowCount ? list.getAllNotifications().length : undefined;
            return (
              <UISidebarItem key={list.id} action={goToList} target={list} isActive={isActive} badgeCount={count} />
            );
          })}
        </UIItemGroup>
        <UIItemGroup>
          <UISidebarItem action={createNotificationList} />
        </UIItemGroup>
      </UIItems>
    </UIHolder>
  );
});

const UIHolder = styled.div<{ $isOpened: boolean }>`
  width: ${SIDEBAR_WIDTH}px;
  flex-grow: 1;
  ${theme.shadow.popover};
  color: #fff;
  ${theme.radius.panel};
  z-index: 3;

  padding-top: ${SYSTEM_BAR_HEIGHT}px;
  ${sidebarShowTransition};

  transform: translateX(${(props) => (props.$isOpened ? 0 : -SIDEBAR_WIDTH)}px);
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
  row-gap: 16px;
`;

const UISidebarItem = styled(SidebarItem)``;
