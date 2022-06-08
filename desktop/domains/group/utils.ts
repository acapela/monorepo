import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { NotificationOrGroup } from "./groupNotifications";

/**
 * countRepeats([{name: "Adam"}, {name: "Adam"}, {name: "Omar"}], item => item.name)
 *
 * will return map: {
 *   Adam: 2,
 *   Omar: 1
 * }
 *
 * Note: if getter returns undefined - it is not counted
 */
export function countRepeats<I, R>(input: I[], getter: (item: I) => R | undefined): Map<R, number> {
  const resultsMap = new Map<R, number>();

  for (const item of input) {
    const result = getter(item);

    if (result === undefined) continue;

    const currentCount = resultsMap.get(result) ?? 0;

    resultsMap.set(result, currentCount + 1);
  }

  return resultsMap;
}

export function notificationOrGroupHasSome(
  notificationOrGroup: NotificationOrGroup,
  check: (notification: NotificationEntity) => boolean
): boolean {
  if (notificationOrGroup.kind === "group") {
    return notificationOrGroup.notifications.some((notification) => check(notification));
  }

  return check(notificationOrGroup);
}

export function notificationOrGroupHasEvery(
  notificationOrGroup: NotificationOrGroup,
  check: (notification: NotificationEntity) => boolean
): boolean {
  if (notificationOrGroup.kind === "group") {
    return notificationOrGroup.notifications.every((notification) => check(notification));
  }

  return check(notificationOrGroup);
}
