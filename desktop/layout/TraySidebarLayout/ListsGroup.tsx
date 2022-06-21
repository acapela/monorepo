import { observer } from "mobx-react";
import React, { Fragment } from "react";
import styled, { css } from "styled-components";

import {
  deleteNotificationList,
  goToList,
  renameNotificationList,
  resolveAllNotifications,
} from "@aca/desktop/actions/lists";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { desktopRouter } from "@aca/desktop/routes";
import { ShortcutKey } from "@aca/ui/keyboard/codes";
import { ShortcutDefinition } from "@aca/ui/keyboard/shortcutBase";

import { SidebarItem } from "./SidebarItem";

export const SIDEBAR_WIDTH = 270;

export const sidebarShowTransition = css`
  transition: 0.3s all;
`;

interface Props {
  lists: NotificationsList[];
}

export const SidebarListsGroup = observer(({ lists }: Props) => {
  return (
    <UIItemGroup>
      {lists
        .filter((list) => !list.isHidden)
        .map((list, index) => {
          const isActive = desktopRouter.getIsRouteActive("list", { listId: list.id });
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
                requiresReconnection={list.requiresReconnection}
                badgeCount={() => {
                  if (list.dontShowCount) return;

                  return list.getCountIndicator();
                }}
                additionalShortcut={additionalShortcut}
                contextMenuActions={
                  list.listEntity
                    ? [renameNotificationList, deleteNotificationList, resolveAllNotifications]
                    : [resolveAllNotifications]
                }
              />
            </Fragment>
          );
        })}
    </UIItemGroup>
  );
});

const UIItemGroup = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UISidebarItem = styled(SidebarItem)``;
