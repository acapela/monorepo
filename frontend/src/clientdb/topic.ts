import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { TopicFragment, UpdatedTopicsQuery, UpdatedTopicsQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { userEntity } from "./user";
import { getType } from "./utils";

const topicFragment = gql`
  fragment Topic on topic {
    id
    closed_at
    updated_at
    closed_by_user_id
    closing_summary
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
      topic(where: { updated_at: { _gte: $lastSyncDate } }) {
        ...Topic
      }
    }
  `
);

export const topicEntity = defineEntity(
  {
    type: getType<TopicFragment>(),
    name: "topic",
    getCacheKey: (space) => space.id,
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToTopicUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.topic);
        });
      },
    },
  },
  (topic) => {
    const memberIds = topic.membersIds.map((member) => member.user_id);
    return {
      get members() {
        return clientdb.user.query((user) => memberIds.includes(user.id));
      },
      get room() {
        return clientdb.room.findById(topic.room_id);
      },
      get space() {
        const room = clientdb.room.findById(topic.room_id);

        if (!room) return null;

        return clientdb.space.findById(room.space_id);
      },
      get messages() {
        return clientdb.message.query((message) => message.topic_id === topic.id);
      },
    };
  }
);
