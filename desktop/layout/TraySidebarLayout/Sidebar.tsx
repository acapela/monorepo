import { observer } from "mobx-react";
import React, { Fragment, useRef } from "react";
import styled, { css } from "styled-components";

import {
  createNotificationList,
  deleteNotificationList,
  goToList,
  renameNotificationList,
} from "@aca/desktop/actions/lists";
import { toggleMaximizeRequest } from "@aca/desktop/bridge/system";
import { allNotificationsList, getInboxLists, outOfInboxLists } from "@aca/desktop/domains/list/all";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { getExactIsRouteActive } from "@aca/desktop/routes";
import { systemBarPlaceholder } from "@aca/desktop/ui/systemTopBar/ui";
import { ShortcutKey } from "@aca/ui/keyboard/codes";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";
import { theme } from "@aca/ui/theme";

import { SidebarItem } from "./SidebarItem";

export const SIDEBAR_WIDTH = 270;

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
      <UIWindowDragger
        onDoubleClick={() => {
          toggleMaximizeRequest();
        }}
      />
      <UIItems>
        <UIItemGroup>
          <ActionSystemMenuItem
            action={goToList}
            path={["View", "List"]}
            target={allNotificationsList}
            customShortcut={["Meta", "1"]}
            group="lists-dropdown"
          />
          <UISidebarItem
            action={goToList}
            target={allNotificationsList}
            isActive={getExactIsRouteActive("list", { listId: "allNotifications" })}
            badgeCount={allNotificationsList.getAllNotifications().length}
            additionalShortcut={["Meta", "1"]}
          />
        </UIItemGroup>

        <UIItemGroup>
          {getInboxLists()
            .filter((list) => list.id !== allNotificationsList.id)
            .map((list, index) => {
              const isActive = getExactIsRouteActive("list", { listId: list.id });
              const count = list.getAllNotifications().length;
              const additionalShortcut: ShortcutDefinition = ["Meta", `${index + 2}` as ShortcutKey];
              return (
                <Fragment key={list.id}>
                  <ActionSystemMenuItem
                    action={goToList}
                    path={["View", "List"]}
                    target={list}
                    customShortcut={additionalShortcut}
                    group="lists-dropdown"
                  />

                  <UISidebarItem
                    action={goToList}
                    target={list}
                    isActive={isActive}
                    badgeCount={count}
                    additionalShortcut={additionalShortcut}
                    contextMenuActions={list.isCustom ? [renameNotificationList, deleteNotificationList] : []}
                  />
                </Fragment>
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
  ${theme.radius.panel};
  z-index: 3;

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
  row-gap: 16px;
`;

const UISidebarItem = styled(SidebarItem)``;

const UIWindowDragger = styled.div`
  ${systemBarPlaceholder};
  ${theme.common.dragWindow};
`;
