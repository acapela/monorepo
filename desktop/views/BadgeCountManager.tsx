import { uniq } from "lodash";
import { observer } from "mobx-react";

import { applicationWideSettingsBridge, setBadgeCountRequest } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { useAutorun } from "@aca/shared/sharedState";

// Open notifications are neither resolved nor snoozed
function getOpenNotifications() {
  const listIdsToShowBadge = applicationWideSettingsBridge.get().notificationsCountBadgeListIds;

  if (!listIdsToShowBadge?.length) {
    return getNullableDb()?.notification.query({ isResolved: false, isSnoozed: false }).all;
  }

  const lists = getNullableDb()?.notificationList.query({ id: listIdsToShowBadge }).all ?? [];

  return uniq(lists.map((l) => l.inboxNotifications.all).flat());
}

export const BadgeCountManager = observer(() => {
  useAutorun(() => {
    if (!applicationWideSettingsBridge.get().showNotificationsCountBadge) {
      setBadgeCountRequest(0);
      return;
    }

    const openNotifications = getOpenNotifications();

    if (openNotifications === undefined) return;

    const unreadCount = openNotifications.filter((n) => n.isUnread).length;
    if (unreadCount > 0) {
      setBadgeCountRequest(unreadCount);
    } else {
      setBadgeCountRequest(openNotifications.length > 0 ? "•" : 0);
    }
  });

  return null;
});
