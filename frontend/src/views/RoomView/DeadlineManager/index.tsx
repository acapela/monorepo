import { gql } from "@apollo/client";
import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useUpdateRoom } from "~frontend/views/RoomView/shared";
import { DeadlineManager_RoomFragment } from "~gql";
import { DateTimeInput } from "~ui/time/DateTimeInput";

export const DeadlineManager = withFragments(
  {
    room: gql`
      fragment DeadlineManager_room on room {
        id
        deadline
      }
    `,
  },
  ({ room, isReadonly }: { room: DeadlineManager_RoomFragment; isReadonly?: boolean }) => {
    const [updateRoom] = useUpdateRoom();
    return (
      <DateTimeInput
        isReadonly={isReadonly}
        value={new Date(room.deadline)}
        onChange={async (deadline: Date) => {
          const oldDeadline = new Date(room.deadline);
          await updateRoom({ variables: { id: room.id, input: { deadline: deadline.toISOString() } } });
          trackEvent("Updated Room Deadline", { roomId: room.id, newDeadline: date, oldDeadline });
        }}
      />
    );
  }
);
