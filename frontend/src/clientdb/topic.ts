import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  PushUpdateTopicMutation,
  PushUpdateTopicMutationVariables,
  TopicFragment,
  Topic_Insert_Input,
  Topic_Set_Input,
  UpdatedTopicsQuery,
  UpdatedTopicsQueryVariables,
} from "~gql";

import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

const topicFragment = gql`
  fragment Topic on topic {
    id
    closed_at
    updated_at
    closed_by_user_id
    closing_summary
    archived_at
    owner_id
    index
    name
    room_id
    slug
    team_id
  }
`;

const [, { subscribe: subscribeToTopicUpdates }] = createQuery<UpdatedTopicsQuery, UpdatedTopicsQueryVariables>(
  () => gql`
    ${topicFragment}

    query UpdatedTopics($lastSyncDate: timestamptz) {
      topic(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...Topic
      }
    }
  `
);

const [, { mutate: updateTopic }] = createMutation<PushUpdateTopicMutation, PushUpdateTopicMutationVariables>(
  () => gql`
    ${topicFragment}
    mutation PushUpdateTopic($input: topic_insert_input!) {
      insert_topic_one(
        object: $input
        on_conflict: {
          constraint: thread_pkey
          update_columns: [archived_at, closed_at, closed_by_user_id, closing_summary, index, name, owner_id, slug]
        }
      ) {
        ...Topic
      }
    }
  `
);

function convertChangedDataToInput({
  id,
  archived_at,
  name,
  slug,
  index,
  closed_at,
  closed_by_user_id,
  closing_summary,
  owner_id,
  team_id,
}: Partial<TopicFragment>): Topic_Insert_Input {
  return { id, archived_at, name, slug, index, closed_at, closed_by_user_id, closing_summary, owner_id, team_id };
}

console.log("list of keys", getFragmentKeys<TopicFragment>(topicFragment));

export const topicEntity = defineEntity<TopicFragment>({
  name: "topic",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TopicFragment>(topicFragment),
  defaultSort: (topic) => topic.index,
  getDefaultValues() {
    return {
      __typename: "topic",
      ...getGenericDefaultData(),
    };
  },
  sync: {
    pull({ lastSyncDate, updateItems }) {
      return subscribeToTopicUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.topic);
      });
    },
    async push(task) {
      const result = await updateTopic({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((topic, { getEntity }) => {
  return {
    get owner() {
      return getEntity(userEntity).findById(topic.owner_id);
    },
    get messages() {
      return getEntity(messageEntity).query((message) => message.topic_id === topic.id);
    },
    get isArchived() {
      return !!topic.archived_at;
    },
    get closedByUser() {
      if (!topic.closed_by_user_id) return null;
      return getEntity(userEntity).findById(topic.closed_by_user_id);
    },
  };
});

export type TopicEntity = EntityByDefinition<typeof topicEntity>;
