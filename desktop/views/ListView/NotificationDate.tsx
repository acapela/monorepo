import { isEqual } from "lodash";
import { computed } from "mobx";
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
  return (
    <UIDate>
      {computed(
        () => {
          mobxTicks.minute.reportObserved();

          return relativeShortFormatDate(new Date(notification.created_at));
        },
        { equals: isEqual }
      ).get()}
    </UIDate>
  );
})``;
