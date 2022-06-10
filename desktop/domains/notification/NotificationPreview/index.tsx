import { observer } from "mobx-react";
import React, { useEffect } from "react";

import {
  addReminderToNotification,
  openNotificationInApp,
  resolveNotification,
} from "@aca/desktop/actions/notification";
import { previewEventsBridge } from "@aca/desktop/bridge/preview";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { Embed } from "@aca/desktop/domains/embed";

import { runActionWith } from "../../runAction";

type Props = {
  notification: NotificationEntity;
};

export const NotificationPreview = observer(function NotificationPreview({ notification }: Props) {
  const { url } = notification;
  useEffect(() => {
    return previewEventsBridge.subscribe((event) => {
      if (event.url !== url) {
        return;
      }

      if (event.type === "add-reminder-request") {
        runActionWith(addReminderToNotification, notification);
      }

      if (event.type === "resolve-request") {
        runActionWith(resolveNotification, notification);
      }

      if (event.type === "open-in-app-request") {
        runActionWith(openNotificationInApp, notification);
      }
    });
  }, [notification]);

  return <Embed key={notification.id} url={url} />;
});
