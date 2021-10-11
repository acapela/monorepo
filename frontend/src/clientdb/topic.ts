import gql from "graphql-tag";

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
}).addConnections((topic, { getEntity, getContextValue }) => {
  const messages = getEntity(messageEntity).query({ topic_id: topic.id });

  const tasks = getEntity(taskEntity).query({ message_id: () => messages.all.map((message) => message.id) });

  const participants = getEntity(userEntity).query((user) => {
    if (user.id === getContextValue(userIdContext)) return true;
    return messages.query((message) => message.tasks.query({ user_id: user.id }).hasItems).hasItems;
  });

  return {
    get owner() {
      return getEntity(userEntity).findById(topic.owner_id);
    },
    messages,
    tasks,
    participants,
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
