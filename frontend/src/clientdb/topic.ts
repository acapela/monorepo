import gql from "graphql-tag";
import { uniqBy } from "lodash";
import router from "next/router";

import { EntityByDefinition, cachedComputedWithoutArgs, defineEntity } from "~clientdb";
import { topicMemberEntity } from "~frontend/clientdb/topicMember";
import { TopicFragment } from "~gql";
import { isNotNullish } from "~shared/nullish";
import { routes } from "~shared/routes";
import { getTopicSlug } from "~shared/routes/topicSlug";
import { slugifySync } from "~shared/slugify";

import { lastSeenMessageEntity } from "./lastSeenMessage";
import { messageEntity } from "./message";
import { taskEntity } from "./task";
import { teamEntity } from "./team";
import { topicEventEntity } from "./topicEvent";
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
    archived_at
    owner_id
    index
    name
    slug
    team_id
    priority
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
      priority: null,
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
      "priority",
    ],
    updateColumns: ["archived_at", "closed_at", "closed_by_user_id", "index", "name", "owner_id", "slug", "priority"],
    teamScopeCondition: (teamId) => ({ team_id: { _eq: teamId } }),
  }),
  search: { fields: { name: true } },
})
  .addConnections((topic, { getEntity, getContextValue, updateSelf }) => {
    const currentUserId = getContextValue(userIdContext);
    const messages = getEntity(messageEntity).query({ topic_id: topic.id });
    const getMessageIds = cachedComputedWithoutArgs(() => {
      return messages.all.map((message) => message.id);
    });

    const lastSeenMessageByCurrentUserQuery = getEntity(lastSeenMessageEntity).query({
      // We have to provide this value, otherwise it would find only by topic_id. Let's give non existing id if there is no user.
      user_id: currentUserId ?? "no-user",
      topic_id: topic.id,
    });

    function getOwner() {
      return getEntity(userEntity).findById(topic.owner_id);
    }

    const tasks = getEntity(taskEntity).query({
      message_id: () => getMessageIds.get(),
    });

    const unreadMessages = getEntity(messageEntity)
      .query({ topic_id: topic.id })
      .query((message) => {
        // Don't consider self made messages as unread
        if (message.user_id === currentUserId) return false;

        const lastUnreadMessageInfo = lastSeenMessageByCurrentUserQuery.first;

        if (!lastUnreadMessageInfo) return true;

        return new Date(message.updated_at) >= new Date(lastUnreadMessageInfo.seen_at);
      });

    const topicMembers = getEntity(topicMemberEntity).query({ topic_id: topic.id });

    const events = getEntity(topicEventEntity).query({ topic_id: topic.id });

    const connections = {
      get owner() {
        return getOwner();
      },
      messages,
      tasks,
      get openSelfAssignedTasks() {
        return tasks.query((task) => task.isAssignedToSelf && !task.isDone);
      },
      get members(): UserEntity[] {
        return uniqBy(
          [getOwner(), ...topicMembers.all.map((topicMember) => topicMember.user)].filter(isNotNullish),
          "id"
        );
      },
      get isCurrentUserMember() {
        return Boolean(currentUserId && connections.members.some((user) => user.id === currentUserId));
      },
      get team() {
        return getEntity(teamEntity).findById(topic.team_id);
      },
      get href() {
        const team = connections.team;

        const firstMessage = connections.messages.first;

        /**
         * If for some reason topic has no messages - we'll get slug directly from title
         * Note: this is safe as slug has no functional meaning in url, it is only for readable link
         */
        const slug = firstMessage
          ? getTopicSlug(firstMessage.content, topic.name)
          : slugifySync(topic.name, "unnamed-topic");

        return routes.topicByHandle({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          teamSlug: team!.slug,
          topicSlug: slug,
          topicId: topic.id,
        });
      },
      get duplicateHref() {
        const team = connections.team;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const firstMessage = connections.messages.first!;

        const slug = getTopicSlug(firstMessage.content, topic.name);

        return routes.topicDuplicate({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          teamSlug: team!.slug,
          topicSlug: slug,
          topicId: topic.id,
        });
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
        if (!currentUserId) return null;

        // There is unique index so we know there is only one 'last_seen_message' per user per topic
        return lastSeenMessageByCurrentUserQuery.first ?? null;
      },

      close() {
        if (connections.isClosed) return;
        const closed_at = new Date().toISOString();
        const closed_by_user_id = currentUserId;

        return updateSelf({ closed_at, closed_by_user_id });
      },

      archive() {
        if (connections.isArchived) return;
        connections.close();
        return updateSelf({ archived_at: new Date().toISOString() });
      },

      open() {
        return updateSelf({ closed_at: null, closed_by_user_id: null, archived_at: null });
      },

      navigateTo() {
        router.push(connections.href);
      },

      unreadMessages,

      events,
    };

    return connections;
  })
  .addAccessValidation((topic) => {
    return topic.isCurrentUserMember;
  })
  .addEventHandlers({
    itemUpdated: (topicNow, topicBefore, { getEntity }) => {
      const topicEventClient = getEntity(topicEventEntity);

      const isNameChanged = topicNow.name !== topicBefore.name;
      if (isNameChanged) {
        topicEventClient.create({
          topic_id: topicNow.id,
          topic_from_name: topicBefore.name,
          topic_to_name: topicNow.name,
        });
      }

      const isOpenStatusChanged = topicNow.closed_at !== topicBefore.closed_at;
      if (isOpenStatusChanged) {
        topicEventClient.create({
          topic_id: topicNow.id,
          topic_from_closed_at: topicBefore.closed_at,
          topic_to_closed_at: topicNow.closed_at,
        });
      }

      const isArchivedStatusChanged = topicNow.archived_at !== topicBefore.archived_at;
      if (isArchivedStatusChanged) {
        topicEventClient.create({
          topic_id: topicNow.id,
          topic_from_archived_at: topicBefore.archived_at,
          topic_to_archived_at: topicNow.archived_at,
        });
      }

      const isPriorityChanged = topicNow.priority !== topicBefore.priority;
      if (isPriorityChanged) {
        topicEventClient.create({
          topic_id: topicNow.id,
          topic_from_priority: topicBefore.priority,
          topic_to_priority: topicNow.priority,
        });
      }
    },
  });

export type TopicEntity = EntityByDefinition<typeof topicEntity>;
