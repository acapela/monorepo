import { startOfDay } from "date-fns";
import styled from "styled-components";
import { NotificationInfoFragment } from "~gql";
import { relativeFormatDate } from "~shared/dates/format";
import { CategoryNameLabel } from "~ui/theme/functional";
import { groupByDate } from "~shared/dates/groupByDate";
import { NotificationLabel } from "./NotificationLabel";
import { ErrorBoundary } from "~ui/ErrorBoundary";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconNotificationIndicator } from "~ui/icons";
import { sortByDate } from "~shared/dates/utils";

interface Props {
  notifications: NotificationInfoFragment[];
}

function sortNotificationsByDate(notifications: NotificationInfoFragment[]) {
  return sortByDate(notifications, (notification) => new Date(notification.created_at), "newer-first");
}

export function NotificationsTimeline({ notifications }: Props) {
  const notificationsByDay = groupByDate(notifications, (notification) =>
    startOfDay(new Date(notification.created_at))
  );

  return (
    <UIHolder>
      {notificationsByDay.length === 0 && (
        <EmptyStatePlaceholder description="No notifications yet" icon={<IconNotificationIndicator />} />
      )}
      {notificationsByDay.map((dayNotificationsGroup) => {
        return (
          <UINotificationsDayGroup key={dayNotificationsGroup.date.getTime()}>
            <CategoryNameLabel>{relativeFormatDate(dayNotificationsGroup.date)}</CategoryNameLabel>
            <UINotificationsList>
              {sortNotificationsByDate(dayNotificationsGroup.items).map((notification) => {
                return (
                  <ErrorBoundary errorFallback={null}>
                    <NotificationLabel key={notification.id} notification={notification} />
                  </ErrorBoundary>
                );
              })}
            </UINotificationsList>
          </UINotificationsDayGroup>
        );
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const UINotificationsDayGroup = styled.div<{}>`
  ${CategoryNameLabel} {
    margin-bottom: 10px;
  }
`;

const UINotificationsList = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
