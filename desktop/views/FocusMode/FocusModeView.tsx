import { observer } from "mobx-react";
import React from "react";

import { BrowserViewBridge, PreloadBrowserView } from "@aca/desktop/BrowserViewBridge";
import { getDb } from "@aca/desktop/clientdb";
import { unresolvedNotificationsComputed } from "@aca/desktop/hooks/useUnresolvedNotifications";
import { AppLayout } from "@aca/desktop/layout/AppLayout";

import { FocusModeTray } from "./Tray";

export const FocusModeView = observer(({ notificationId }: { notificationId: string }) => {
  const db = getDb();
  const currentNotification = db.notification.assertFindById(notificationId);

  const unresolvedNotifications = unresolvedNotificationsComputed.get();
  const currentIndex = unresolvedNotifications.findIndex((n) => n.id === notificationId);

  // We limit the amount of notifications to preload to the previous one and the next 3
  const notificationsToPreload = unresolvedNotifications.slice(Math.max(currentIndex - 1, 0), currentIndex + 3);

  return (
    <AppLayout tray={<FocusModeTray />} footer={null}>
      {currentIndex !== -1 &&
        notificationsToPreload.map((notification) => (
          <PreloadBrowserView key={notification.id} url={notification.url} />
        ))}

      <BrowserViewBridge url={currentNotification.url} />
    </AppLayout>
  );
});
