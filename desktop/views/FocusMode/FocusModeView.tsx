import * as Sentry from "@sentry/react";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { exitFocusMode, refreshNotificationPreview } from "@aca/desktop/actions/focus";
import {
  copyNotificationLink,
  openNotificationInApp,
  resolveNotification,
  snoozeNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { getDb } from "@aca/desktop/clientdb";
import { getInboxListsById } from "@aca/desktop/domains/list/all";
import { NotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/PreloadNotificationPreview";
import { PreviewLoadingPriority } from "@aca/desktop/domains/preview";
import { ActionSystemMenuItem } from "@aca/desktop/domains/systemMenu/ActionSystemMenuItem";
import { SystemMenuGroup } from "@aca/desktop/domains/systemMenu/SystemMenuGroup";
import { AppLayout } from "@aca/desktop/layout/AppLayout";
import { appViewContainerStyles } from "@aca/desktop/layout/Container";
import { uiStore } from "@aca/desktop/store/ui";
import { uiSettings } from "@aca/desktop/store/uiSettings";

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

  useEffect(() => {
    const activeListId = list?.id ?? null;
    const activeNotification = notification;
    runInAction(() => {
      uiStore.activeListId = activeListId;
      uiStore.activeNotification = activeNotification;
    });
    return () => {
      if (uiStore.activeNotification === activeNotification && uiStore.activeListId === activeListId) {
        uiStore.activeListId = null;
        uiStore.activeNotification = null;
      } else {
        Sentry.captureException(new Error("Tried to reset values set by another component"));
      }
    };
  }, [list?.id, notification]);

  return (
    <AppLayout footer={<FocusModeFooter />} transparent>
      <ActionSystemMenuItem action={unresolveNotification} path={["Notification"]} target={notification} />
      <ActionSystemMenuItem action={resolveNotification} path={["Notification"]} target={notification} />
      <ActionSystemMenuItem action={snoozeNotification} path={["Notification"]} target={notification} />
      <SystemMenuGroup>
        <ActionSystemMenuItem action={refreshNotificationPreview} path={["Notification"]} target={notification} />
        <ActionSystemMenuItem action={openNotificationInApp} path={["Notification"]} target={notification} />
        <ActionSystemMenuItem action={copyNotificationLink} path={["Notification"]} target={notification} />
        <ActionSystemMenuItem action={exitFocusMode} path={["View"]} target={notification} group="foo" />
      </SystemMenuGroup>

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
