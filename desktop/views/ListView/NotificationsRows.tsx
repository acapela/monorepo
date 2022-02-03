import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";

import { NotificationRow } from "./NotificationRow";

interface Props {
  list: NotificationsList;
  notifications: NotificationEntity[];
}

export const NotificationsRows = observer(({ notifications, list }: Props) => {
  return (
    <UINotifications>
      {notifications.map((notification) => {
        return <NotificationRow list={list} key={notification.id} notification={notification} />;
      })}
    </UINotifications>
  );
});

const UINotifications = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 0;
`;
