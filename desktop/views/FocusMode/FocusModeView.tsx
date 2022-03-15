import { getDb } from "@aca/desktop/clientdb";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { NotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/PreloadNotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { uiSettings } from "@aca/desktop/store/uiSettings";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { FocusModeFooter } from "./FocusModeFooter";
import { FocusStats } from "./FocusStats";
import { FocusModeTopBar } from "./TopBar";

interface Props {
  notificationId: string;
  listId: string;
}

export const FocusModeView = observer(({ notificationId, listId }: Props) => {
  const db = getDb();
  const notification = db.notification.assertFindById(notificationId);

  const list = getInboxListsById(listId);

  return (
    <AppLayout footer={<FocusModeFooter />}>
      <FocusModeTopBar notification={notification} />
      <UIHeader>
        {list?.getNotificationsToPreload(notification).map((notificationToPreload) => {
          return (
            <PreloadNotificationPreview
              priority={PreviewLoadingPriority.next}
              key={notificationToPreload.id}
              url={notificationToPreload.url}
            />
          );
        })}

        {uiSettings.showFocusModeStats && (
          <UIStats>{list && <FocusStats list={list} currentNotification={notification} />}</UIStats>
        )}
      </UIHeader>
      <NotificationPreview notification={notification} />
    </AppLayout>
  );
});

const UIHeader = styled.div`
  ${appViewContainerStyles};
`;

const UIStats = styled.div`
  margin: 16px 0;
`;
