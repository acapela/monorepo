import React from "react";
import styled, { css } from "styled-components";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { NotificationsGroup } from "@aca/desktop/domains/group/group";
import { assert } from "@aca/shared/assert";
import { styledObserver } from "@aca/shared/component";
import { relativeFormatDateTime } from "@aca/shared/dates/format";
import { IconClockZzz } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

export function isNotificationSnoozeEnded({ snoozed_until, last_seen_at, isSnoozed }: NotificationEntity) {
  if (!snoozed_until) {
    return false;
  }

  const hasPreviouslyBeenSnoozed = !isSnoozed && snoozed_until;
  if (!last_seen_at && hasPreviouslyBeenSnoozed) {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Date(snoozed_until).getTime() > new Date(last_seen_at!).getTime();
}

interface Props {
  notificationOrGroup: NotificationEntity | NotificationsGroup;
  className?: string;
}

type SnoozeLifecycle =
  | "never-snoozed"
  | "snooze-ongoing"
  | "snooze-is-done-and-is-unread"
  | "snooze-is-done-and-is-read";

interface SnoozeState {
  tooltip?: string;
  displayedSnoozedTime?: string;
  lifecycle: SnoozeLifecycle;
}

function getDefaultTooltip(notification: NotificationEntity) {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return `Snoozed Until: ${new Date(notification.snoozed_until! ?? undefined).toLocaleString()}`;
}

function getSnoozedNotificationThatFinishedClosestToNow(group: NotificationsGroup) {
  const allSnoozedNotifications = group.notifications.filter((n) => !!n.snoozed_until);
  const snoozedNotificationThatFinishedTheFurthestInThePast = allSnoozedNotifications.sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return new Date(b.snoozed_until!).getTime() - new Date(a.snoozed_until!).getTime();
  });

  return snoozedNotificationThatFinishedTheFurthestInThePast[0];
}

function getNotificationSnoozeState(notification: NotificationEntity): SnoozeState {
  if (!notification.snoozed_until) {
    return { lifecycle: "never-snoozed" };
  }

  if (notification.isSnoozed) {
    return {
      lifecycle: "snooze-ongoing",

      tooltip: getDefaultTooltip(notification),
      displayedSnoozedTime: relativeFormatDateTime(new Date(notification.snoozed_until)),
    };
  }

  if (isNotificationSnoozeEnded(notification)) {
    return {
      lifecycle: "snooze-is-done-and-is-unread",
      tooltip: getDefaultTooltip(notification),
    };
  }

  return {
    lifecycle: "snooze-is-done-and-is-read",

    tooltip: getDefaultTooltip(notification),
  };
}

function getGroupSnoozeState(group: NotificationsGroup): SnoozeState {
  if (group.notifications.every((n) => !n.snoozed_until)) {
    return { lifecycle: "never-snoozed" };
  }

  if (group.notifications.some((n) => n.isSnoozed)) {
    const notificationSnoozeCount = group.notifications.filter((n) => n.isSnoozed).length;
    const ongoingSnoozeNotification = group.notifications.find((n) => n.isSnoozed);

    assert(ongoingSnoozeNotification, "could not find snoozed notification");

    return {
      lifecycle: "snooze-ongoing",
      tooltip:
        !group.isOnePreviewEnough && notificationSnoozeCount > 1
          ? `${notificationSnoozeCount} notifications snoozed`
          : getDefaultTooltip(ongoingSnoozeNotification),
    };
  }

  if (group.notifications.some(isNotificationSnoozeEnded)) {
    const unreadNotificationsAfterComingBackFromSnooze = group.notifications.filter(isNotificationSnoozeEnded);
    return {
      lifecycle: "snooze-is-done-and-is-unread",
      tooltip:
        !group.isOnePreviewEnough && unreadNotificationsAfterComingBackFromSnooze.length > 1
          ? `${unreadNotificationsAfterComingBackFromSnooze.length} previously snoozed notifications`
          : getDefaultTooltip(unreadNotificationsAfterComingBackFromSnooze[0]),
    };
  }

  const earliestSnoozedInGroup = getSnoozedNotificationThatFinishedClosestToNow(group);

  return { lifecycle: "snooze-is-done-and-is-read", tooltip: getDefaultTooltip(earliestSnoozedInGroup) };
}

function getSnoozeState(notificationOrGroup: NotificationEntity | NotificationsGroup): SnoozeState {
  if (notificationOrGroup.kind === "group") {
    return getGroupSnoozeState(notificationOrGroup);
  }

  return getNotificationSnoozeState(notificationOrGroup);
}

export const SnoozeLabel = styledObserver(function SnoozeLabel({
  notificationOrGroup: notification,
  className,
}: Props) {
  const snoozeState = getSnoozeState(notification);
  if (snoozeState.lifecycle === "never-snoozed") {
    return <></>;
  }

  return (
    <UIHolder className={className} $lifecycle={snoozeState.lifecycle} data-tooltip={snoozeState.tooltip}>
      <IconClockZzz />
      {snoozeState.displayedSnoozedTime && <span>{snoozeState.displayedSnoozedTime}</span>}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{ $lifecycle: SnoozeLifecycle }>`
  display: inline-flex;
  gap: 8px;
  padding: 4px;
  height: 100%;
  ${theme.radius.button};

  svg {
    height: 1rem;
    width: 1rem;
  }

  ${(props) => {
    switch (props.$lifecycle) {
      case "snooze-ongoing":
      case "snooze-is-done-and-is-unread":
        return css`
          ${theme.colors.tags.feedback.asBgWithReadableText};
        `;
      case "snooze-is-done-and-is-read":
        return css`
          ${theme.colors.layout.backgroundAccent.asBgWithReadableText};
        `;
    }
  }}
`;
