import gql from "graphql-tag";
import { uniqBy } from "lodash";

import { EntityByDefinition, cachedComputed, defineEntity } from "~clientdb";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { TopicFragment } from "~gql";
import { isNotNullish } from "~shared/nullish";

import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageEntity } from "./message";
import { TaskEntity, taskEntity } from "./task";
import { topicEventEntity } from "./topicEvent";
import { UserEntity, userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { teamIdContext, userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

export const sortByEarliestTaskDueDate = (task: TaskEntity) => task.message?.dueDate;

const topicFragment = gql`
  fragment Topic on topic {
    id
    closed_at
    updated_at
    created_at
    closed_by_user_id
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
      "owner_id",
      "team_id",
    ],
    updateColumns: ["archived_at", "closed_at", "closed_by_user_id", "index", "name", "owner_id", "slug"],
    teamScopeCondition: (teamId) => ({ team_id: { _eq: teamId } }),
  }),
  search: { fields: { name: true } },
})
  .addConnections((topic, { getEntity, getContextValue }) => {
    const currentUserId = getContextValue(userIdContext);
    const messages = getEntity(messageEntity).query({ topic_id: topic.id });
    const getMessageIds = cachedComputed(() => {
      return messages.all.map((message) => message.id);
    });

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

    function getOwner() {
      return getEntity(userEntity).findById(topic.owner_id);
    }

    const tasks = getEntity(taskEntity).query({
      message_id: () => getMessageIds(),
    });

    const getunfinishedTaskWithEarliestDueDateByCurrentUser = cachedComputed(() => {
      return tasks.query({ isAssignedToSelf: true, hasDueDate: true, isDone: false }, sortByEarliestTaskDueDate).first;
    });

    const unreadMessages = getEntity(messageEntity)
      .query({ topic_id: topic.id })
      .query((message) => {
        return message.isUnread;
      });

    const topicMembers = getEntity(topicMemberEntity).query({ topic_id: topic.id });

    const events = getEntity(topicEventEntity).query({ topic_id: topic.id });

    const connections = {
      get owner() {
        return getOwner();
      },
      messages,
      tasks,
      get members(): UserEntity[] {
        return uniqBy(
          [getOwner(), ...topicMembers.all.map((topicMember) => topicMember.user)].filter(isNotNullish),
          "id"
        );
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

      close() {
        const closed_at = new Date().toISOString();
        const closed_by_user_id = currentUserId;

        return getEntity(topicEntity).query({ id: topic.id }).first?.update({ closed_at, closed_by_user_id });
      },

      open() {
        return getEntity(topicEntity)
          .query({ id: topic.id })
          .first?.update({ closed_at: null, closed_by_user_id: null, archived_at: null });
      },

      unreadMessages,

      get currentUserUnfinishedTaskWithEarliestDueDate() {
        return getunfinishedTaskWithEarliestDueDateByCurrentUser();
      },

      events,
    };

    return connections;
  })
  .addAccessValidation((topic) => {
    return topic.isCurrentUserMember;
  })
  .addEventHandlers({
    itemUpdated: (topicNow, topicBefore, { getEntity }) => {
      const isNameChanged = topicNow.name !== topicBefore.name;
      if (isNameChanged) {
        getEntity(topicEventEntity).create({
          topic_id: topicNow.id,
          topic_from_name: topicBefore.name,
          topic_to_name: topicNow.name,
        });
      }

      const isOpenStatusChanged = topicNow.closed_at !== topicBefore.closed_at;
      if (isOpenStatusChanged) {
        getEntity(topicEventEntity).create({
          topic_id: topicNow.id,
          topic_from_closed_at: topicBefore.closed_at,
          topic_to_closed_at: topicNow.closed_at,
        });
      }

      const isArchivedStatusChanged = topicNow.archived_at !== topicBefore.archived_at;
      if (isArchivedStatusChanged) {
        getEntity(topicEventEntity).create({
          topic_id: topicNow.id,
          topic_from_archived_at: topicBefore.archived_at,
          topic_to_archived_at: topicNow.archived_at,
        });
      }
    },
  });

export type TopicEntity = EntityByDefinition<typeof topicEntity>;
