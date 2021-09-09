import { gql } from "@apollo/client";
import { observer } from "mobx-react";
import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { RoomEntity } from "~frontend/clientdb/room";
import { DateTimeInput } from "~ui/time/DateTimeInput";

type Props = { room: RoomEntity; isReadonly?: boolean };

export const DeadlineManager = observer(({ room, isReadonly }: Props) => {
  return (
    <DateTimeInput
      isReadonly={isReadonly}
      value={new Date(room.deadline)}
      onChange={(deadline: Date) => {
        const oldDeadline = new Date(room.deadline);
        room.update({ deadline: deadline.toISOString() });
        trackEvent("Updated Room Deadline", { roomId: room.id, newDeadline: deadline, oldDeadline });
      }}
    />
  );
});
