import { Reference, gql, useMutation } from "@apollo/client";
import styled from "styled-components";

import {
  ArchiveTopicMutation,
  ArchiveTopicMutationVariables,
  DeleteTopicMutation,
  DeleteTopicMutationVariables,
  UpdateTopicNameMutation,
  UpdateTopicNameMutationVariables,
} from "~gql";
import { addToast } from "~ui/toasts/data";

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
  useMutation<DeleteTopicMutation, DeleteTopicMutationVariables & { roomId: string }>(
    gql`
      mutation DeleteTopic($id: uuid!) {
        topic: delete_topic_by_pk(id: $id) {
          id
          room_id
        }
      }
    `,
    {
      optimisticResponse: ({ id, roomId }) => ({
        topic: { __typename: "topic", id, room_id: roomId },
      }),
      update(cache, { data }) {
        if (!data || !data.topic) {
          return;
        }
        const { topic } = data;
        const topicRef = cache.identify(topic);
        cache.modify({
          id: cache.identify({ __typename: "room", id: topic.room_id }),
          fields: {
            topics: (existing: Reference[]) => existing.filter((t) => cache.identify(t) !== topicRef),
          },
        });
      },
      onCompleted() {
        addToast({ type: "success", title: "Topic was removed" });
      },
    }
  );

export const useArchiveTopic = () =>
  useMutation<ArchiveTopicMutation, ArchiveTopicMutationVariables & { roomId: string }>(
    gql`
      mutation ArchiveTopic($id: uuid!, $archivedAt: timestamptz!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { archived_at: $archivedAt }) {
          id
        }
      }
    `,
    {
      optimisticResponse: ({ id, roomId }) => ({
        topic: { __typename: "topic", id, room_id: roomId },
      }),
      onCompleted() {
        addToast({ type: "success", title: "Topic was archived" });
      },
    }
  );

export const UITopicsList = styled.div<{}>`
  min-height: 0;
  overflow-y: auto;
`;

export const UITopic = styled.div`
  position: relative;

  margin-bottom: 8px;
`;
