import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { TopicFragment, UpdatedTopicsQuery, UpdatedTopicsQueryVariables } from "~frontend/../../gql";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { messageEntity } from "./message";
import { roomEntity } from "./room";
import { spaceEntity } from "./space";
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
    getId: (topic) => topic.id,
    sync: {
      initPromise: () => renderedApolloClientPromise,
      pull({ lastSyncDate, updateItems }) {
        return subscribeToTopicUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.topic);
        });
      },
    },
  },
  (topic, { getEntity }) => {
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
      get messages() {
        return getEntity(messageEntity).query((message) => message.topic_id === topic.id);
      },
    };
  }
);
