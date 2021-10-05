import { gql, useMutation } from "@apollo/client";

import { UpdateTopicMutation, UpdateTopicMutationVariables } from "~gql";

export const useUpdateTopic = () =>
  useMutation<UpdateTopicMutation, UpdateTopicMutationVariables>(
    gql`
      mutation UpdateTopic($id: uuid!, $input: topic_set_input!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: $input) {
          id
        }
      }
    `,
    {
      optimisticResponse: ({ id, input }) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", ...input, id },
      }),
    }
  );
