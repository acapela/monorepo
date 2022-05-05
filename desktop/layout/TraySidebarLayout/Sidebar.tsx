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
import { FeedbackButton } from "@aca/desktop/domains/feedbackWidget/FeedbackButton";
import { allNotificationsList, getInboxLists, outOfInboxLists } from "@aca/desktop/domains/list/all";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { getExactIsRouteActive } from "@aca/desktop/routes";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";
import { systemBarPlaceholder } from "@aca/desktop/ui/systemTopBar/ui";
import { useDoubleClick } from "@aca/shared/hooks/useDoubleClick";
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
  const sideBarRef = useRef<HTMLDivElement>(null);
  const draggerRef = useRef<HTMLDivElement>(null);

  useDoubleClick(draggerRef, () => {
    toggleMaximizeRequest();
  });

  return (
    <UIHolder ref={sideBarRef} $isOpened={isOpened}>
      <UIWindowDragger ref={draggerRef}>
        <TopBarActionButton action={createNotificationList} />
      </UIWindowDragger>
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
            badgeCount={() => allNotificationsList.getCountIndicator()}
            additionalShortcut={["Meta", "1"]}
          />
        </UIItemGroup>
        <UIItemGroup>
          {getInboxLists()
            .filter((list) => list.id !== allNotificationsList.id)
            .map((list, index) => {
              const isActive = getExactIsRouteActive("list", { listId: list.id });
              // A double digit number shortcut doesn't exist in keyboard and  will crash the app! .e.g Meta+`10`
              const additionalShortcut: ShortcutDefinition | undefined =
                index + 2 < 10 ? ["Meta", `${index + 2}` as ShortcutKey] : undefined;
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
                    badgeCount={() => list.getCountIndicator()}
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

const UISidebarItem = styled(SidebarItem)``;

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
