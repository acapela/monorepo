import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { openNotificationInApp } from "@aca/desktop/actions/notification";
import { getDb } from "@aca/desktop/clientdb";
import { getPredefinedListById } from "@aca/desktop/domains/list/preconfigured";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import {
  NotificationEmbedView,
  PreloadNotificationEmbed,
} from "@aca/desktop/domains/notification/NotificationEmbedView";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { theme } from "@aca/ui/theme";

import { FocusModeFooter } from "./FocusModeFooter";
import { FocusModeTray } from "./Tray";

interface Props {
  notificationId: string;
  listId: string;
}

export const FocusModeView = observer(({ notificationId, listId }: Props) => {
  const db = getDb();
  const notification = db.notification.assertFindById(notificationId);

  const list = getPredefinedListById(listId);

  return (
    <AppLayout tray={<FocusModeTray />} footer={<FocusModeFooter />}>
      {list?.getNotificationsToPreload(notification).map((notificationToPreload) => {
        return <PreloadNotificationEmbed key={notificationToPreload.id} url={notificationToPreload.url} />;
      })}

      <UIHeader>
        <NotificationAppIcon notification={notification} />
        <UITitle>{getNotificationTitle(notification)}</UITitle>
        <ActionIconButton action={openNotificationInApp} target={notification} showTitleInTooltip />
      </UIHeader>

      <NotificationEmbedView url={notification.url} />
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
