import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { focusOnNotificationPreview } from "@aca/desktop/actions/focus";
import { openNotificationInApp } from "@aca/desktop/actions/notification";
import { getDb } from "@aca/desktop/clientdb";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { NotificationAppIcon } from "@aca/desktop/domains/notification/NotificationAppIcon";
import { NotificationPreview, PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { getNotificationTitle } from "@aca/desktop/domains/notification/title";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { uiStore } from "@aca/desktop/store/ui";
import { uiSettings } from "@aca/desktop/store/uiSettings";
import { ActionIconButton } from "@aca/desktop/ui/ActionIconButton";
import { niceFormatDateTime, relativeShortFormatDate } from "@aca/shared/dates/format";
import { theme } from "@aca/ui/theme";

import { FocusModeFooter } from "./FocusModeFooter";
import { FocusStats } from "./FocusStats";
import { FocusModeTray } from "./Tray";

interface Props {
  notificationId: string;
  listId: string;
}

export const FocusModeView = observer(({ notificationId, listId }: Props) => {
  const db = getDb();
  const notification = db.notification.assertFindById(notificationId);

  useEffect(() => {
    runInAction(() => {
      uiStore.focusedNotification = notification;
    });
  }, [notification]);

  const list = getInboxListsById(listId);

  return (
    <AppLayout tray={<FocusModeTray />} footer={<FocusModeFooter />}>
      {list?.getNotificationsToPreload(notification).map((notificationToPreload) => {
        return (
          <PreloadNotificationPreview
            priority={PreviewLoadingPriority.next}
            key={notificationToPreload.id}
            url={notificationToPreload.url}
          />
        );
      })}

      <UIHeader>
        <NotificationAppIcon notification={notification} />
        <UITitle>
          {getNotificationTitle(notification)}{" "}
          <UIDate data-tooltip={niceFormatDateTime(new Date(notification.created_at))}>
            {relativeShortFormatDate(new Date(notification.created_at))}
          </UIDate>
        </UITitle>
        <ActionIconButton action={focusOnNotificationPreview} target={notification} showTitleInTooltip />

        <ActionIconButton action={openNotificationInApp} target={notification} showTitleInTooltip />
      </UIHeader>
      {uiSettings.showFocusModeStats && (
        <UISubHeader>{list && <FocusStats list={list} currentNotification={notification} />}</UISubHeader>
      )}

      <NotificationPreview url={notification.url} />
    </AppLayout>
  );
});

const UITitle = styled.div`
  ${theme.typo.secondaryTitle.semibold};
  ${theme.common.ellipsisText}
  min-width: 0;
  flex-grow: 1;
`;

const UIHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
  padding-right: 16px;

  ${NotificationAppIcon} {
    ${theme.typo.secondaryTitle}
  }
`;

const UISubHeader = styled.div`
  margin-bottom: 16px;
`;

const UIDate = styled.span`
  opacity: 0.6;
`;
