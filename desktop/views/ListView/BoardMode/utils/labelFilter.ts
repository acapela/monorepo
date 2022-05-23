import { uniq } from "lodash";

import { NotificationStatusLabelEntity } from "@aca/desktop/clientdb/notificationStatusLabel";
import { getIsNotificationsGroup } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { isNotNullish } from "@aca/shared/nullish";

function getAcceptedLabels(notificationOrGroup: NotificationOrGroup) {
  if (getIsNotificationsGroup(notificationOrGroup)) {
    const allLabels = notificationOrGroup.notifications
      .map((notification) => notification.statusLabel)
      .filter(isNotNullish);
    if (allLabels.length === 0) return null;

    return uniq(allLabels);
  }

  const label = notificationOrGroup.statusLabel;

  if (!label) return null;

  return [label];
}

function getIsItemMatchingLabel(notificationOrGroup: NotificationOrGroup, label: NotificationStatusLabelEntity | null) {
  const acceptedLabels = getAcceptedLabels(notificationOrGroup);

  if (!acceptedLabels) {
    return !label;
  }

  if (!label) return false;

  return acceptedLabels.includes(label);
}

export function getNotificationsMatchingLabel(all: NotificationOrGroup[], label: NotificationStatusLabelEntity | null) {
  return all.filter((notificationOrGroup) => {
    return getIsItemMatchingLabel(notificationOrGroup, label);
  });
}
