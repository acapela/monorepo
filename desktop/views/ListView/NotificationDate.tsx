import React from "react";

import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { styledObserver } from "@aca/shared/component";
import { relativeShortFormatDate } from "@aca/shared/dates/format";
import { mobxTicks } from "@aca/shared/mobx/time";

import { UIDate } from "./shared";

interface Props {
  notification: NotificationEntity;
}

export const NotificationDate = styledObserver(({ notification }: Props) => {
  mobxTicks.minute.reportObserved();

  return <UIDate>{relativeShortFormatDate(new Date(notification.created_at))}</UIDate>;
})``;
