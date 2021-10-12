/* eslint-disable @typescript-eslint/no-non-null-assertion */
import gql from "graphql-tag";
import { maxBy } from "lodash";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { TopicFragment } from "~gql";

import { messageEntity } from "./message";
import { taskEntity } from "./task";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { teamIdContext, userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

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
  }),
  search: { fields: { name: true } },
})
  .addConnections((topic, { getEntity, getContextValue }) => {
    const messages = getEntity(messageEntity).query({ topic_id: topic.id });

    const tasks = getEntity(taskEntity).query({ message_id: () => messages.all.map((message) => message.id) });

    const participants = getEntity(userEntity).query((user) => {
      if (topic.owner_id === user.id) return true;

      if (getEntity(messageEntity).query({ user_id: user.id, topic_id: topic.id }).hasItems) return true;

      return messages.query((message) => message.tasks.query({ user_id: user.id }).hasItems).hasItems;
    });

    return {
      get owner() {
        return getEntity(userEntity).findById(topic.owner_id);
      },
      messages,
      tasks,
      get participants() {
        return participants;
      },
      get isCurrentUserParticipating() {
        const userId = getContextValue(userIdContext);

        if (!userId) return false;

        if (topic.owner_id === userId) return true;

        if (getEntity(messageEntity).query({ user_id: userId, topic_id: topic.id }).hasItems) return true;
        // TODO: optimize
        return messages.query((message) => message.tasks.query({ user_id: userId }).hasItems).hasItems;
      },
      get isOwn() {
        return topic.owner_id === getContextValue(userIdContext);
      },
      get isClosed() {
        return !!topic.closed_at;
      },
      get isNew() {
        return false;
        return !!topic.archived_at;
      },
      get lastActivityDate() {
        if (!messages.hasItems) {
          return new Date(topic.updated_at);
        }

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
    };
  })
  .addAccessValidation((topic) => {
    return topic.isCurrentUserParticipating;
  });

export type TopicEntity = EntityByDefinition<typeof topicEntity>;
