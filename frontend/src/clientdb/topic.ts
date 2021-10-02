import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { TopicFragment } from "~gql";

import { teamIdContext, userIdContext } from "./context";
import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
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
    room_id
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
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "topic",
      archived_at: null,
      closed_at: null,
      closed_by_user_id: null,
      closing_summary: null,
      team_id: getContextValue(teamIdContext) ?? undefined,
      owner_id: getContextValue(userIdContext) ?? undefined,
      room_id: null,
      index: "0",
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<TopicFragment>(topicFragment, {
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
    upsertIdKey: "thread_pkey",
  }),
}).addConnections((topic, { getEntity, getContextValue }) => {
  return {
    get owner() {
      return getEntity(userEntity).findById(topic.owner_id);
    },
    get messages() {
      return getEntity(messageEntity).query((message) => message.topic_id === topic.id);
    },
    get isOwn() {
      return topic.owner_id === getContextValue(userIdContext);
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
