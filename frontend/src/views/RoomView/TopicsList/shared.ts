import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";

import {
  DeleteTopicMutation,
  DeleteTopicMutationVariables,
  UpdateTopicNameMutation,
  UpdateTopicNameMutationVariables,
} from "~gql";
import { addToast } from "~ui/toasts/data";

import { TopicMenuItem } from "./TopicMenuItem";

export const useUpdateTopicName = () =>
  useMutation<UpdateTopicNameMutation, UpdateTopicNameMutationVariables>(
    gql`
      mutation UpdateTopicName($id: uuid!, $name: String!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { name: $name }) {
          id
          name
        }
      }
    `,
    {
      optimisticResponse: ({ id, name }) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id, name },
      }),
    }
  );

export const useDeleteTopic = () =>
  useMutation<DeleteTopicMutation, DeleteTopicMutationVariables>(
    gql`
      mutation DeleteTopic($id: uuid!) {
        topic: delete_topic_by_pk(id: $id) {
          id
        }
      }
    `,
    {
      onCompleted() {
        addToast({ type: "success", title: "Topic was removed" });
      },
    }
  );

export const UIScrollContainer = styled.div<{}>`
  height: 100%;
  overflow-y: auto;
`;

export const UITopicsList = styled.div<{}>``;

export const UITopic = styled.div`
  position: relative;

  margin-bottom: 8px;

  ${TopicMenuItem} {
    margin-bottom: 4px;
  }
`;
