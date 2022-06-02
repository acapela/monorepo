import { uniq } from "lodash";

import { applicationWideSettingsBridge } from "@aca/desktop/bridge/system";
import { getNullableDb } from "@aca/desktop/clientdb";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";

import { allNotificationsList } from "../list/all";
import { getCountIndicatorFromNotifications } from "../list/count";

function getOpenNotificationsForBadge(): NotificationEntity[] {
  const listIdsToShowBadge = applicationWideSettingsBridge.get().notificationsCountBadgeListIds;

  if (!listIdsToShowBadge?.length) {
    return allNotificationsList.getAllNotifications();
  }

  const listsToShowNotifications = getNullableDb()?.notificationList.find({ id: listIdsToShowBadge }) ?? [];

  return uniq(
    listsToShowNotifications
      .map((list) => {
        return list.inboxNotifications.all;
      })
      .flat()
  );
}

export function getBadgeCountToShow() {
  const settings = applicationWideSettingsBridge.get();

  if (!settings.showNotificationsCountBadge) {
    return 0;
  }

  const allOpenNotificationsForBadge = getOpenNotificationsForBadge();

  const showOnlyUnread = settings.showUnreadNotificationsCountBadge;

  if (!showOnlyUnread) {
    return getCountIndicatorFromNotifications(allOpenNotificationsForBadge);
  }

  const unreadNotifications = allOpenNotificationsForBadge.filter((notification) => notification.isUnread);

  const unreadBadgeCount = getCountIndicatorFromNotifications(unreadNotifications);

  if (unreadBadgeCount > 0) {
    return unreadBadgeCount;
  }

  if (allOpenNotificationsForBadge.length > 0) {
    return "•";
  }

  return 0;
}
