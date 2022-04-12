import { action } from "mobx";
import React, { useEffect, useRef } from "react";
import styled, { css } from "styled-components";

import {
  copyNotificationLink,
  markNotificationRead,
  markNotificationUnread,
  openFocusMode,
  openNotificationInApp,
  resolveNotification,
  snoozeNotification,
  unresolveNotification,
  unsnoozeNotification,
} from "@aca/desktop/actions/notification";
import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { useActionsContextMenu } from "@aca/desktop/domains/contextMenu/useActionsContextMenu";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/PreloadNotificationPreview";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { theme } from "@aca/ui/theme";

import { NotificationDate } from "./NotificationDate";
import { RowQuickActions } from "./RowQuickActions";
import { UINotificationPreviewText, UINotificationRowTitle, UISendersLabel } from "./shared";
import { SnoozeLabel } from "./SnoozeLabel";

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
      [resolveNotification, unresolveNotification, snoozeNotification, unsnoozeNotification],
      [copyNotificationLink],
      [markNotificationRead, markNotificationUnread],
    ],
    notification
  );

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 150, offDelay: 0 });

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

  const title = getNotificationTitle(notification);
  return (
    <ActionTrigger action={openFocusMode} target={notification}>
      {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
      {isFocusedForAWhile && <PreloadNotificationPreview url={notification.url} />}
      <UIHolder
        ref={elementRef}
        $isFocused={isFocused}
        $preloadingState={
          devSettingsStore.debugPreloading && preloadingNotificationsBridgeChannel.get()[notification.url]
        }
      >
        <UIUnreadIndicator $isUnread={notification.isUnread} />
        <NotificationAppIcon notification={notification} />
        <UISendersLabel>{notification.from}</UISendersLabel>

        {title && <UINotificationRowTitle>{title}&nbsp;</UINotificationRowTitle>}
        <UINotificationPreviewText>{notification.text_preview}</UINotificationPreviewText>

        {!notification.isResolved && <SnoozeLabel notificationOrGroup={notification} />}

        <NotificationDate notification={notification} />

        {isFocused && <RowQuickActions target={notification} />}
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean; $preloadingState?: "loading" | "ready" | "error" | false }>`
  ${theme.box.items.listRow.size.padding}
  min-width: 0;

  ${(props) => props.$isFocused && theme.colors.layout.backgroundAccent.asBg};

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

export const UIUnreadIndicator = styled.div<{ $isUnread: boolean }>`
  height: 4px;
  width: 4px;

  ${(props) =>
    props.$isUnread &&
    css`
      ${theme.colors.text.asBg};
      border: 1px solid ${theme.colors.text};
    `}

  ${theme.radius.circle}
`;
