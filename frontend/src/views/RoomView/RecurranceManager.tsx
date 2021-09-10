import { observer } from "mobx-react";
import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { RoomEntity } from "~frontend/clientdb/room";
import { RecurranceIntervalInDays } from "~frontend/rooms/recurrance/RecurranceIntervalInDays";
import { RecurrancePicker } from "~frontend/rooms/recurrance/RecurrancePicker";

type Props = { room: RoomEntity; isReadonly?: boolean };

export const RecurranceManager = observer(({ room, isReadonly }: Props) => {
  const handleChange = (recurranceIntervalInDays: RecurranceIntervalInDays) => {
    room.update({ recurrance_interval_in_days: recurranceIntervalInDays });

    if (recurranceIntervalInDays && !room.recurrance_interval_in_days) {
      trackEvent("Made Room Recurring", { roomId: room.id, intervalInDays: recurranceIntervalInDays });
    } else if (!recurranceIntervalInDays && room.recurrance_interval_in_days) {
      trackEvent("Made Room Non-recurring", { roomId: room.id });
    }
  };

  return (
    <RecurrancePicker
      isDisabled={isReadonly}
      onChange={handleChange}
      shouldShowName={false}
      recurranceIntervalInDays={(room.recurrance_interval_in_days || null) as RecurranceIntervalInDays}
    />
  );
});
