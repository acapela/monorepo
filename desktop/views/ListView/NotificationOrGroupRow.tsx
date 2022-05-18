import React from "react";

import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { styledObserver } from "@aca/shared/component";

import { NotificationRow } from "./NotificationRow";
import { NotificationsGroupRow } from "./NotificationsGroupRow";

interface Props {
  notificationOrGroup: NotificationOrGroup;
}

export const NotificationOrGroupRow = styledObserver(({ notificationOrGroup }: Props) => {
  if (getIsNotificationsGroup(notificationOrGroup)) {
    return <NotificationsGroupRow key={notificationOrGroup.id} group={notificationOrGroup} />;
  }

  return <NotificationRow key={notificationOrGroup.id} notification={notificationOrGroup} />;
})``;
