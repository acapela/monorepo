import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import {
  addReminderToNotification,
  cancelSaveNotification,
  copyNotificationLink,
  markNotificationRead,
  markNotificationUnread,
  openFocusMode,
  openNotificationInApp,
  removeNotificationReminder,
  resolveNotification,
  saveNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { PreloadingState, preloadingPreviewsBridgeChannel } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { getNotificationMeta } from "@aca/desktop/domains/notification/meta";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { theme } from "@aca/ui/theme";

import { NotificationDate } from "./NotificationDate";
import { NotificationTags } from "./NotificationTags";
import {
  UIAnimatedHighlight,
  UINotificationAppIcon,
  UINotificationRowTitle,
  UIReminderLabel,
  UIRowQuickActions,
  UISendersLabel,
  UIUnreadIndicator,
  useStoreRowVisibility,
} from "./shared";

interface Props {
  notification: NotificationEntity;
}

export const NotificationRow = styledObserver(({ notification }: Props) => {
  const isFocused = uiStore.useFocus(notification);

  const elementRef = useRef<HTMLDivElement>(null);

  useActionsContextMenu(
    elementRef,
    [
      [openFocusMode, openNotificationInApp],
      [saveNotification, cancelSaveNotification],
      [resolveNotification, unresolveNotification, addReminderToNotification, removeNotificationReminder],
      [copyNotificationLink],
      [markNotificationRead, markNotificationUnread],
    ],
    notification
  );

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 75, offDelay: 0 });

  useEffect(() => {
    if (!isFocused) return;
    makeElementVisible(elementRef.current);
  }, [isFocused]);

  useUserFocusedOnElement(
    elementRef,
    action(() => {
      uiStore.focusedTarget = notification;
    }),
    action(() => {
      if (isFocused) {
        uiStore.focusedTarget = null;
      }
    })
  );

  useStoreRowVisibility(elementRef, notification.id);

  const { title, tags } = getNotificationMeta(notification);

  return (
    <ActionTrigger action={openFocusMode} target={notification}>
      {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
      {isFocusedForAWhile && <PreloadEmbed url={notification.url} />}
      <UIHolder
        ref={elementRef}
        $isFocused={isFocused}
        $preloadingState={devSettingsStore.debugPreloading && preloadingPreviewsBridgeChannel.get()[notification.url]}
      >
        {isFocused && <UIAnimatedHighlight />}
        <UIUnreadIndicator $isUnread={notification.isUnread} />
        <UINotificationAppIcon notification={notification} />
        <UISendersLabel>{notification.from}</UISendersLabel>
        {tags && <NotificationTags tags={tags} />}
        {title && <UINotificationRowTitle>{title}&nbsp;</UINotificationRowTitle>}
        {!notification.isResolved && <UIReminderLabel notificationOrGroup={notification} />}
        {isFocused && <UIRowQuickActions target={notification} />}
        <NotificationDate notification={notification} key={notification.id} />
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean; $preloadingState?: PreloadingState | false }>`
  ${theme.box.items.listRow.size.padding}
  min-width: 0;
  position: relative;

  ${(props) => {
    const status = props.$preloadingState;

    if (!status) return null;

    function getColor() {
      if (status === "loading") return "orange";
      if (status === "error") return "red";
      return "green";
    }

    return css`
      outline: 1px solid ${getColor()};
      outline-offset: -1px;
    `;
  }}

  ${NotificationAppIcon} {
    font-size: 24px;
  }
`;
