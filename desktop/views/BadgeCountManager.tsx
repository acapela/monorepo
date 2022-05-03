import { uniq } from "lodash";
import { observer } from "mobx-react";

import { applicationWideSettingsBridge, setBadgeCountRequest } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { useAutorun } from "@aca/shared/sharedState";

// Open notifications are neither resolved nor snoozed
function getOpenNotifications() {
  const listIdsToShowBadge = applicationWideSettingsBridge.get().notificationsCountBadgeListIds;

  if (!listIdsToShowBadge?.length) {
    return getNullableDb()?.notification.find({ isResolved: false, isSnoozed: false });
  }

  const lists = getNullableDb()?.notificationList.find({ id: listIdsToShowBadge }) ?? [];

  return uniq(lists.map((l) => l.inboxNotifications.all).flat());
}

export const BadgeCountManager = observer(() => {
  useAutorun(() => {
    const settings = applicationWideSettingsBridge.get();

    if (!settings.showNotificationsCountBadge) {
      setBadgeCountRequest(0);
      return;
    }

    const openNotifications = getOpenNotifications();

    if (openNotifications === undefined) return;

    if (!settings.showUnreadNotificationsCountBadge) {
      setBadgeCountRequest(openNotifications.length);
    } else {
      const unreadCount = openNotifications.filter((n) => n.isUnread).length;
      if (unreadCount > 0) {
        setBadgeCountRequest(unreadCount);
      } else {
        // If there are open notifications, but all are read, we still show an indicator
        setBadgeCountRequest(openNotifications.length > 0 ? "•" : 0);
      }
    }
  });

  return null;
});
