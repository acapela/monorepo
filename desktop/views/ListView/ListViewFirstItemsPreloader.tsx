import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { NotificationsList } from "@aca/desktop/domains/list/defineList";
import { PreloadNotificationPreview } from "@aca/desktop/domains/notification/NotificationPreview";

interface Props {
  list: NotificationsList;
}

export const ListViewFirstItemsPreloader = observer(({ list }: Props) => {
  const firstNotification = computed(() => list.getAllNotifications().at(0)).get();

  return <>{firstNotification && <PreloadNotificationPreview url={firstNotification.url} />}</>;
});
