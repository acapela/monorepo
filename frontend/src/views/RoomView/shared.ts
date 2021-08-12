import { gql, useMutation } from "@apollo/client";

import {
  UpdateRoomMutation,
  UpdateRoomMutationVariables,
  UpdateTopicMutation,
  UpdateTopicMutationVariables,
} from "~gql";

const localeOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

export const formatDate = (date?: string | null) => {
  return date && date.length > 0 ? new Date(date).toLocaleDateString(undefined, localeOptions) : "--";
};

export const useUpdateRoom = () =>
  useMutation<UpdateRoomMutation, UpdateRoomMutationVariables>(
    gql`
      mutation UpdateRoom($id: uuid!, $input: room_set_input!) {
        room: update_room_by_pk(pk_columns: { id: $id }, _set: $input) {
          id
        }
      }
    `
  );

export const useUpdateTopic = () =>
  useMutation<UpdateTopicMutation, UpdateTopicMutationVariables>(
    gql`
      mutation UpdateTopic($id: uuid!, $input: topic_set_input!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: $input) {
          id
        }
      }
    `
  );
