import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { openFocusMode } from "@aca/desktop/actions/focus";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { DefinedList } from "@aca/desktop/domains/list/defineList";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { PreloadNotificationEmbed } from "@aca/desktop/domains/notification/NotificationEmbedView";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { uiStore } from "@aca/desktop/store/uiStore";
import { ActionTrigger } from "@aca/desktop/ui/ActionTrigger";
import { styledObserver } from "@aca/shared/component";
import { useUserFocusedOnElement } from "@aca/shared/hooks/useUserFocusedOnElement";
import { theme } from "@aca/ui/theme";

interface Props {
  notification: NotificationEntity;
  list: DefinedList;
}

export const NotificationRow = styledObserver(({ notification, list }: Props) => {
  const isFocused = uiStore.focusedTarget === notification;
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFocused) return;
    elementRef.current?.scrollIntoView({ behavior: "auto", block: "nearest", inline: "nearest" });

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
        <UITitle>{getNotificationTitle(notification)}</UITitle>
      </UIHolder>
    </ActionTrigger>
  );
})``;

const UIHolder = styled.div<{ $isFocused: boolean }>`
  padding: 8px 8px;
  display: flex;
  align-items: center;
  gap: 24px;

  ${(props) => props.$isFocused && theme.colors.layout.backgroundAccent.asBg};

  ${NotificationAppIcon} {
    font-size: 24px;
  }
`;

const UITitle = styled.div`
  ${theme.typo.content.semibold}
`;
