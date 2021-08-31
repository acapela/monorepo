import { gql, useMutation, useSubscription } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import {
  RecurranceManagerSubscription,
  RecurranceManagerSubscriptionVariables,
  RecurranceManager_RoomFragment,
  UpdateRoomRecurringDaysMutation,
  UpdateRoomRecurringDaysMutationVariables,
} from "~gql";

import { RecurringDays } from "./getRecurringDaysLabel";
import { RecurrancePicker } from "./RecurrancePicker";

const fragments = {
  room: gql`
    fragment RecurranceManager_room on room {
      id
      recurring_days
    }
  `,
};

type Props = { room: RecurranceManager_RoomFragment; isReadonly?: boolean };

export const RecurranceManager = withFragments(fragments, ({ room, isReadonly }: Props) => {
  const [updateRoomRecurringDays] = useMutation<
    UpdateRoomRecurringDaysMutation,
    UpdateRoomRecurringDaysMutationVariables
  >(
    gql`
      mutation UpdateRoomRecurringDays($id: uuid!, $recurring_days: Int) {
        room: update_room_by_pk(pk_columns: { id: $id }, _set: { recurring_days: $recurring_days }) {
          id
          recurring_days
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

  const handleChange = async (recurringDays: RecurringDays) => {
    await updateRoomRecurringDays({ variables: { id: room.id, recurring_days: recurringDays } });
  };

  const picker = (
    <RecurrancePicker onChange={handleChange} shouldShowName={false} recurringDays={room.recurring_days || null} />
  );

  if (isReadonly) {
    return <UIReadonly>{picker}</UIReadonly>;
  }

  return picker;
});

const UIReadonly = styled.div`
  pointer-events: none;
`;
