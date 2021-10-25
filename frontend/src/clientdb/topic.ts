import gql from "graphql-tag";
import { maxBy } from "lodash";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { TopicFragment } from "~gql";
import { isNotNullish } from "~shared/nullish";

import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageEntity } from "./message";
import { taskEntity } from "./task";
import { UserEntity, userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { teamIdContext, userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const topicFragment = gql`
  fragment Topic on topic {
    id
    closed_at
    updated_at
    created_at
    closed_by_user_id
    closing_summary
    archived_at
    owner_id
    index
    name
    slug
    team_id
  }
`;

export const topicEntity = defineEntity<TopicFragment>({
  name: "topic",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TopicFragment>(topicFragment),
  defaultSort: (topic) => topic.index,
  uniqueIndexes: ["slug"],
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "topic",
      archived_at: null,
      closed_at: null,
      closed_by_user_id: null,
      closing_summary: null,
      team_id: getContextValue(teamIdContext) ?? undefined,
      owner_id: getContextValue(userIdContext) ?? undefined,
      index: "0",
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<TopicFragment>(topicFragment, {
    insertColumns: [
      "id",
      "archived_at",
      "name",
      "slug",
      "index",
      "closed_at",
      "closed_by_user_id",
      "closing_summary",
      "owner_id",
      "team_id",
    ],
    updateColumns: [
      "archived_at",
      "closed_at",
      "closed_by_user_id",
      "closing_summary",
      "index",
      "name",
      "owner_id",
      "slug",
    ],
    teamScopeCondition: (teamId) => ({ team_id: { _eq: teamId } }),
  }),
  search: { fields: { name: true } },
})
  .addConnections((topic, { getEntity, getContextValue }) => {
    const currentUserId = getContextValue(userIdContext);
    const messages = getEntity(messageEntity).query({ topic_id: topic.id });

    const unseenMessages = getEntity(lastSeenMessageEntity).query({
      // We have to provide this value, otherwise it would find only by topic_id. Let's give non existing id if there is no user.
      user_id: currentUserId ?? "no-user",
      topic_id: topic.id,
    });

    function getLastSeenMessageByCurrentUserInfo() {
      if (!currentUserId) return null;

      // There is unique index so we know there is only one 'last_seen_message' per user per topic
      return unseenMessages.first ?? null;
    }

    const unreadMessages = getEntity(messageEntity)
      .query({ topic_id: topic.id })
      .query((message) => {
        return message.isUnread;
      });

    const connections = {
      get owner() {
        return getEntity(userEntity).findById(topic.owner_id);
      },
      messages,
      get members(): UserEntity[] {
        return [
          connections.owner,
          ...getEntity(topicMemberEntity)
            .query({ topic_id: topic.id })
            .all.map((topicMember) => topicMember.user),
        ].filter(isNotNullish);
      },
      get tasks() {
        const tasks = getEntity(taskEntity).query({
          message_id: () => messages.all.map((message) => message.id),
        });
        return tasks;
      },
      get isCurrentUserMember() {
        return Boolean(currentUserId && connections.members.some((user) => user.id === currentUserId));
      },
      get isOwn() {
        return topic.owner_id === currentUserId;
      },
      get isClosed() {
        return !!topic.closed_at;
      },
      get lastActivityDate() {
        if (!messages.hasItems) {
          return new Date(topic.updated_at);
        }
        if (topic.closed_at) {
          return new Date(topic.closed_at);
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const messageWithLatestActivity = maxBy(messages.all, (message) => message.lastActivityDate)!;

        return messageWithLatestActivity.lastActivityDate;
      },
      get isArchived() {
        return !!topic.archived_at;
      },
      get closedByUser() {
        if (!topic.closed_by_user_id) return null;
        return getEntity(userEntity).findById(topic.closed_by_user_id);
      },
      get lastSeenMessageByCurrentUserInfo() {
        return getLastSeenMessageByCurrentUserInfo();
      },
      unreadMessages,
    };

    return connections;
  })
  .addAccessValidation((topic) => {
    return topic.isCurrentUserMember;
  });

export type TopicEntity = EntityByDefinition<typeof topicEntity>;
