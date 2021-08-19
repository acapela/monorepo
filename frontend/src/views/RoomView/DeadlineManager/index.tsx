import { gql, useSubscription } from "@apollo/client";
import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useUpdateRoom } from "~frontend/views/RoomView/shared";
import { DeadlineManagerSubscription, DeadlineManagerSubscriptionVariables, DeadlineManager_RoomFragment } from "~gql";
import { DateTimeInput } from "~ui/time/DateTimeInput";

const fragments = {
  room: gql`
    fragment DeadlineManager_room on room {
      id
      deadline
    }
  `,
};

export const DeadlineManager = withFragments(
  fragments,
  ({ room, isReadonly }: { room: DeadlineManager_RoomFragment; isReadonly?: boolean }) => {
    const [updateRoom] = useUpdateRoom();
    useSubscription<DeadlineManagerSubscription, DeadlineManagerSubscriptionVariables>(
      gql`
        ${fragments.room}

        subscription DeadlineManager($roomId: uuid!) {
          room_by_pk(id: $roomId) {
            ...DeadlineManager_room
          }
        }
      `,
      { variables: { roomId: room.id } }
    );
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
