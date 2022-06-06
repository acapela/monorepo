import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import {
  cancelSaveNotification,
  copyNotificationLink,
  markNotificationRead,
  markNotificationUnread,
  openFocusMode,
  openNotificationInApp,
  resolveNotification,
  saveNotification,
  snoozeNotification,
  unresolveNotification,
  unsnoozeNotification,
} from "@aca/desktop/actions/notification";
import { preloadingPreviewsBridgeChannel } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { theme } from "@aca/ui/theme";

import { NotificationDate } from "./NotificationDate";
import {
  UIAnimatedHighlight,
  UINotificationAppIcon,
  UINotificationPreviewText,
  UINotificationRowTitle,
  UIRowQuickActions,
  UISendersLabel,
  UISnoozeLabel,
  UIUnreadIndicator,
  useStoreRowVisibility,
} from "./shared";

interface Props {
  notification: NotificationEntity;
  isBundledInGroup?: boolean;
}

export const NotificationRow = styledObserver(({ notification, isBundledInGroup = false }: Props) => {
  const isFocused = uiStore.useFocus(notification);

  const elementRef = useRef<HTMLDivElement>(null);

  useActionsContextMenu(
    elementRef,
    [
      [openFocusMode, openNotificationInApp],
      [saveNotification, cancelSaveNotification],
      [resolveNotification, unresolveNotification, snoozeNotification, unsnoozeNotification],
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

  const title = getNotificationTitle(notification, isBundledInGroup);
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
        {title && <UINotificationRowTitle>{title}&nbsp;</UINotificationRowTitle>}
        <UINotificationPreviewText>{notification.text_preview}</UINotificationPreviewText>
        {!notification.isResolved && !isFocused && <UISnoozeLabel notificationOrGroup={notification} />}
        {isFocused && <UIRowQuickActions target={notification} />}
        <NotificationDate notification={notification} key={notification.id} />
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean; $preloadingState?: "loading" | "ready" | "error" | false }>`
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
