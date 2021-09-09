import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import { TopicFragment, UpdatedTopicsQuery, UpdatedTopicsQueryVariables } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { messageEntity } from "./message";
import { roomEntity } from "./room";
import { spaceEntity } from "./space";
import { userEntity } from "./user";

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
    membersIds: members {
      user_id
    }
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

export const topicEntity = defineEntity<TopicFragment>({
  name: "topic",
  updatedAtField: "updated_at",
  keyField: "id",
  defaultSort: (topic) => topic.index,
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      return subscribeToTopicUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.topic);
      });
    },
  },
}).addConnections((topic, { getEntity }) => {
  const memberIds = topic.membersIds.map((member) => member.user_id);
  return {
    get members() {
      return getEntity(userEntity).query((user) => memberIds.includes(user.id));
    },
    get room() {
      return getEntity(roomEntity).findById(topic.room_id);
    },
    get space() {
      const room = getEntity(roomEntity).findById(topic.room_id);

      if (!room) return null;

      return getEntity(spaceEntity).findById(room.space_id);
    },
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
