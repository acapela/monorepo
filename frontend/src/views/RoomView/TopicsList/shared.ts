import { gql, useMutation } from "@apollo/client";
import styled from "styled-components";

import { DeleteTopicMutation, DeleteTopicMutationVariables } from "~gql";
import { addToast } from "~ui/toasts/data";

import { TopicMenuItem } from "./TopicMenuItem";

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
