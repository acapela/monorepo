import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import {
  DeadlineManagerSubscription,
  DeadlineManagerSubscriptionVariables,
  DeadlineManager_RoomFragment,
  UpdateRoomDeadlineMutation,
  UpdateRoomDeadlineMutationVariables,
} from "~gql";
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
    const [updateRoomDeadline] = useMutation<UpdateRoomDeadlineMutation, UpdateRoomDeadlineMutationVariables>(
      gql`
        mutation UpdateRoomDeadline($id: uuid!, $deadline: timestamptz!) {
          room: update_room_by_pk(pk_columns: { id: $id }, _set: { deadline: $deadline }) {
            id
            deadline
          }
        }
      `,
      {
        optimisticResponse: (vars) => ({ room: { __typename: "room", ...vars } }),
      }
    );
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
          await updateRoomDeadline({ variables: { id: room.id, deadline: deadline.toISOString() } });
          trackEvent("Updated Room Deadline", { roomId: room.id, newDeadline: deadline, oldDeadline });
        }}
      />
    );
  }
);
