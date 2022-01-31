import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { getDb } from "@aca/desktop/clientdb";
import { getPredefinedListById } from "@aca/desktop/domains/list/preconfigured";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import {
  NotificationEmbedView,
  PreloadNotificationEmbed,
} from "@aca/desktop/domains/notification/NotificationEmbedView";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { theme } from "@aca/ui/theme";

import { FocusModeTray } from "./Tray";

interface Props {
  notificationId: string;
  listId: string;
}

export const FocusModeView = observer(({ notificationId, listId }: Props) => {
  const db = getDb();
  const currentNotification = db.notification.assertFindById(notificationId);

  const list = getPredefinedListById(listId);

  return (
    <AppLayout tray={<FocusModeTray />} footer={null}>
      {list?.getNotificationsToPreload(currentNotification).map((notificationToPreload) => {
        return <PreloadNotificationEmbed key={notificationToPreload.id} url={notificationToPreload.url} />;
      })}

      <UIHeader>
        <NotificationAppIcon notification={currentNotification} />
        <UITitle>{getNotificationTitle(currentNotification)}</UITitle>
      </UIHeader>

      <NotificationEmbedView url={currentNotification.url} />
    </AppLayout>
  );
});

const UITitle = styled.div`
  ${theme.typo.secondaryTitle.semibold};
`;

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;

  ${NotificationAppIcon} {
    ${theme.typo.secondaryTitle}
  }
`;
