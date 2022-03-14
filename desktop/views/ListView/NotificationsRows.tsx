import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { NotificationRow } from "./NotificationRow";

interface Props {
  notifications: NotificationEntity[];
}

export const NotificationsRows = observer(({ notifications }: Props) => {
  return (
    <UINotifications>
      {notifications.map((notification) => {
        return <NotificationRow key={notification.id} notification={notification} />;
      })}
    </UINotifications>
  );
});

const UINotifications = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
