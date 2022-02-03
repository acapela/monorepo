import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { openFocusMode } from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { PreloadNotificationEmbed } from "@aca/desktop/domains/notification/NotificationEmbedView";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { uiStore } from "@aca/desktop/store/uiStore";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { relativeShortFormatDate } from "@aca/shared/dates/format";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { makeElementVisible } from "@aca/shared/interactionUtils";
import { mobxTicks } from "@aca/shared/mobx/time";
import { theme } from "@aca/ui/theme";

import { UINotificationRowTitle, UISendersLabel } from "./shared";

interface Props {
  notification: NotificationEntity;
  list: NotificationsList;
}

export const NotificationRow = styledObserver(({ notification, list }: Props) => {
  const isFocused = uiStore.focusedTarget === notification;
  const elementRef = useRef<HTMLDivElement>(null);

  mobxTicks.minute.reportObserved();

  useEffect(() => {
    if (!isFocused) return;
    makeElementVisible(elementRef.current);

    return () => {
      if (uiStore.focusedTarget === notification) {
        uiStore.focusedTarget = null;
      }
    };
  }, [isFocused, notification]);

  useUserFocusedOnElement(
    elementRef,
    () => {
      uiStore.focusedTarget = notification;
    },
    () => {
      if (isFocused) {
        uiStore.focusedTarget = null;
      }
    }
  );

  return (
    <ActionTrigger action={openFocusMode} target={notification}>
      {/* This might be not super smart - we preload 5 notifications around focused one to have some chance of preloading it before you eg. click it */}
      {isFocused &&
        list.getNotificationsToPreload(notification).map((notificationToPreload) => {
          return <PreloadNotificationEmbed key={notificationToPreload.id} url={notificationToPreload.url} />;
        })}
      <UIHolder ref={elementRef} $isFocused={isFocused}>
        <NotificationAppIcon notification={notification} />
        <UISendersLabel>{notification.from}</UISendersLabel>
        <UINotificationRowTitle>{getNotificationTitle(notification)}</UINotificationRowTitle>
        <UIDate>{relativeShortFormatDate(new Date(notification.created_at))}</UIDate>
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean }>`
  padding: 8px 8px;
  display: flex;
  align-items: center;
  gap: 24px;
  min-width: 0;

  ${(props) => props.$isFocused && theme.colors.layout.backgroundAccent.asBg};

  ${NotificationAppIcon} {
    font-size: 24px;
  }
`;

const UIDate = styled.div`
  opacity: 0.6;
`;
