import { action } from "mobx";
import React, { useEffect, useMemo, useRef } from "react";
import styled, { css } from "styled-components";

import { openFocusMode } from "@aca/desktop/actions/notification";
import { preloadingNotificationsBridgeChannel } from "@aca/desktop/bridge/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { devSettingsStore } from "@aca/desktop/domains/dev/store";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { uiStore } from "@aca/desktop/store/ui";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { relativeShortFormatDate } from "@aca/shared/dates/format";
import { useDebouncedBoolean } from "@aca/shared/hooks/useDebouncedValue";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { mobxTicks } from "@aca/shared/mobx/time";
import { theme } from "@aca/ui/theme";

import { UIDate, UINotificationPreviewText, UINotificationRowTitle, UISendersLabel } from "./shared";
import { SnoozeLabel } from "./SnoozeLabel";

interface Props {
  notification: NotificationEntity;
  list: NotificationsList;
}

export const NotificationRow = styledObserver(({ notification, list }: Props) => {
  const isFocused = uiStore.useFocus(notification);
  const elementRef = useRef<HTMLDivElement>(null);

  const isFocusedForAWhile = useDebouncedBoolean(isFocused, { onDelay: 150, offDelay: 0 });

  mobxTicks.minute.reportObserved();

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

  const isUnread: boolean = useMemo(() => {
    if (notification.isResolved) {
      return false;
    }
    return !notification.last_seen_at;
  }, [notification]);

  return (
    <ActionTrigger action={openFocusMode} target={notification}>
      {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
      {isFocusedForAWhile &&
        list.getNotificationsToPreload(notification).map((notificationToPreload) => {
          return (
            <PreloadNotificationPreview
              priority={
                notificationToPreload === notification ? PreviewLoadingPriority.next : PreviewLoadingPriority.following
              }
              key={notificationToPreload.id}
              url={notificationToPreload.url}
            />
          );
        })}
      <UIHolder
        ref={elementRef}
        $isFocused={isFocused}
        $isPreloading={devSettingsStore.debugPreloading && preloadingNotificationsBridgeChannel.get()[notification.url]}
      >
        <NotificationAppIcon notification={notification} displayUnreadNotification={isUnread} />
        <UISendersLabel>{notification.from}</UISendersLabel>

        <UINotificationRowTitle>{getNotificationTitle(notification)}</UINotificationRowTitle>
        <UINotificationPreviewText>{notification.text_preview}</UINotificationPreviewText>

        <SnoozeLabel notificationOrGroup={notification} />

        <UIDate>{relativeShortFormatDate(new Date(notification.created_at))}</UIDate>
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean; $isPreloading?: "loading" | "ready" | false }>`
  padding: 10px 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;

  ${(props) => props.$isFocused && theme.colors.layout.backgroundAccent.asBg};

  ${(props) => {
    const status = props.$isPreloading;

    if (!status) return null;
    return css`
      outline: 1px solid ${status === "loading" ? "orange" : "green"};
      outline-offset: -1px;
    `;
  }}

  ${NotificationAppIcon} {
    font-size: 24px;
  }
`;
