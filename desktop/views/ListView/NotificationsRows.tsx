import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { NotificationRow } from "./NotificationRow";

interface Props {
  notifications: NotificationEntity[];
  isBundledInGroup?: boolean;
}

export const NotificationsRows = observer(({ notifications, isBundledInGroup }: Props) => {
  return (
    <UINotifications>
      {notifications.map((notification) => {
        return (
          <NotificationRow key={notification.id} notification={notification} isBundledInGroup={isBundledInGroup} />
        );
      })}
    </UINotifications>
  );
});

const UINotifications = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
