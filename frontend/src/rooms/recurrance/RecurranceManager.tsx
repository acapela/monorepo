import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import {
  RecurranceManagerSubscription,
  RecurranceManagerSubscriptionVariables,
  RecurranceManager_RoomFragment,
  UpdateRoomRecurranceIntervalInDaysMutation,
  UpdateRoomRecurranceIntervalInDaysMutationVariables,
} from "~gql";

import { RecurranceIntervalInDays } from "./getRecurranceIntervalInDaysLabel";
import { RecurrancePicker } from "./RecurrancePicker";

const fragments = {
  room: gql`
    fragment RecurranceManager_room on room {
      id
      recurrance_interval_in_days
    }
  `,
};

type Props = { room: RecurranceManager_RoomFragment; isReadonly?: boolean };

export const RecurranceManager = withFragments(fragments, ({ room, isReadonly }: Props) => {
  const [updateRoomRecurranceIntervalInDays] = useMutation<
    UpdateRoomRecurranceIntervalInDaysMutation,
    UpdateRoomRecurranceIntervalInDaysMutationVariables
  >(
    gql`
      mutation UpdateRoomRecurranceIntervalInDays($id: uuid!, $recurrance_interval_in_days: Int) {
        room: update_room_by_pk(
          pk_columns: { id: $id }
          _set: { recurrance_interval_in_days: $recurrance_interval_in_days }
        ) {
          id
          recurrance_interval_in_days
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({ room: { __typename: "room", ...vars } }),
    }
  );

  useSubscription<RecurranceManagerSubscription, RecurranceManagerSubscriptionVariables>(
    gql`
      ${fragments.room}

      subscription RecurranceManager($roomId: uuid!) {
        room_by_pk(id: $roomId) {
          ...RecurranceManager_room
        }
      }
    `,
    { variables: { roomId: room.id } }
  );

  const handleChange = async (recurranceIntervalInDays: RecurranceIntervalInDays) => {
    await updateRoomRecurranceIntervalInDays({
      variables: { id: room.id, recurrance_interval_in_days: recurranceIntervalInDays },
    });
  };

  const picker = (
    <RecurrancePicker
      onChange={handleChange}
      shouldShowName={false}
      recurranceIntervalInDays={room.recurrance_interval_in_days || null}
    />
  );

  if (isReadonly) {
    return <UIReadonly>{picker}</UIReadonly>;
  }

  return picker;
});

const UIReadonly = styled.div`
  pointer-events: none;
`;
