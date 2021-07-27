import { startOfDay } from "date-fns";
import { sortBy } from "lodash";
import styled from "styled-components";
import { NotificationInfoFragment } from "~frontend/../../gql";
import { relativeFormatDate } from "~frontend/../../shared/dates/format";
import { CategoryNameLabel } from "~frontend/../../ui/theme/functional";
import { groupByDate } from "~shared/dates/groupByDate";
import { NotificationLabel } from "./NotificationLabel";

interface Props {
  notifications: NotificationInfoFragment[];
}

export function NotificationsTimeline({ notifications }: Props) {
  const notificationsByDay = groupByDate(notifications, (notification) =>
    startOfDay(new Date(notification.created_at))
  );

  return (
    <UIHolder>
      {notificationsByDay.map((dayNotificationsGroup) => {
        return (
          <UINotificationsDayGroup key={dayNotificationsGroup.date.getTime()}>
            <CategoryNameLabel>{relativeFormatDate(dayNotificationsGroup.date)}</CategoryNameLabel>
            <UINotificationsList>
              {sortBy(dayNotificationsGroup.items, (notification) => -new Date(notification.created_at).getTime()).map(
                (notification) => {
                  return <NotificationLabel key={notification.id} notification={notification} />;
                }
              )}
            </UINotificationsList>
          </UINotificationsDayGroup>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const UINotificationsDayGroup = styled.div`
  ${CategoryNameLabel} {
    margin-bottom: 10px;
  }
`;

const UINotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
