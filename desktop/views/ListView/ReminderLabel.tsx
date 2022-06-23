import React from "react";
import styled from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { styledObserver } from "@aca/shared/component";
import { niceFormatDateTime } from "@aca/shared/dates/format";
import { IconBell } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

interface Props {
  notificationOrGroup: NotificationEntity | NotificationsGroup;
  className?: string;
}

function findAndGet<T, R>(items: T[], getter: (item: T) => R | null): R | null {
  for (const item of items) {
    const value = getter(item);

    if (value !== null) return value;
  }

  return null;
}

function getCurrentReminderDate(notificationOrGroup: NotificationOrGroup) {
  if (notificationOrGroup.kind === "group") {
    return findAndGet(notificationOrGroup.notifications, (notification) => notification.reminderDate);
  }

  return notificationOrGroup.reminderDate;
}

export const ReminderLabel = styledObserver(function ReminderLabel({ notificationOrGroup, className }: Props) {
  const currentReminderDate = getCurrentReminderDate(notificationOrGroup);

  if (!currentReminderDate) {
    return <></>;
  }

  return (
    <UIHolder className={className} data-tooltip={`Reminder - ${niceFormatDateTime(currentReminderDate)}`}>
      <IconBell />
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: inline-flex;
  gap: 8px;
  padding: 4px;
  ${theme.radius.badge};
  ${theme.typo.note.semibold}
  ${theme.colors.primary.asBgWithReadableText};

  svg {
    height: 1rem;
    width: 1rem;
  }
`;
