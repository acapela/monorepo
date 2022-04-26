import { computed } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { PreloadEmbed } from "@aca/desktop/domains/embed/PreloadEmbed";
import { NotificationsList } from "@aca/desktop/domains/list/defineList";

interface Props {
  list: NotificationsList;
}

export const ListViewFirstItemsPreloader = observer(({ list }: Props) => {
  const firstNotification = computed(() => list.getAllNotifications().at(0)).get();

  return <>{firstNotification && <PreloadEmbed url={firstNotification.url} />}</>;
});
