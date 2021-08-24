import { gql, useMutation } from "@apollo/client";

import {
  CloseTopicMutation,
  CloseTopicMutationVariables,
  UpdateTopicMutation,
  UpdateTopicMutationVariables,
} from "~gql";

const localeOptions: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

export const formatDate = (date?: string | null) => {
  return date && date.length > 0 ? new Date(date).toLocaleDateString(undefined, localeOptions) : "--";
};

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

export const useCloseTopic = () =>
  useMutation<CloseTopicMutation, CloseTopicMutationVariables>(
    gql`
      mutation CloseTopic($id: uuid!, $closed_at: timestamp, $closed_by_user_id: uuid, $closing_summary: String) {
        topic: update_topic_by_pk(
          pk_columns: { id: $id }
          _set: { closed_at: $closed_at, closed_by_user_id: $closed_by_user_id, closing_summary: $closing_summary }
        ) {
          id
          closed_at
          closed_by_user_id
          closing_summary
        }
      }
    `,
    {
      optimisticResponse: (vars) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", ...vars },
      }),
    }
  );
