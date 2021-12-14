import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { TopicEventFragment } from "~gql";

import { messageEntity } from "./message";
import { topicEntity } from "./topic";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const topicEventFragment = gql`
  fragment TopicEvent on topic_event {
    id
    topic_id
    actor_id
    created_at
    updated_at

    topic_from_closed_at
    topic_to_closed_at

    topic_from_archived_at
    topic_to_archived_at

    topic_from_name
    topic_to_name

    message_task_due_date_message_id
    message_task_due_date_from_due_at
    message_task_due_date_to_due_at

    topic_from_priority
    topic_to_priority
  }
`;

export const topicEventEntity = defineEntity<TopicEventFragment>({
  name: "topic_event",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TopicEventFragment>(topicEventFragment),
  defaultSort: (event) => new Date(event.created_at).getTime(),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "topic_event",
    actor_id: getContextValue(userIdContext) ?? undefined,
    topic_from_closed_at: null,
    topic_to_closed_at: null,
    topic_from_archived_at: null,
    topic_to_archived_at: null,
    topic_from_name: null,
    topic_to_name: null,
    message_task_due_date_message_id: null,
    message_task_due_date_from_due_at: null,
    message_task_due_date_to_due_at: null,
    topic_from_priority: null,
    topic_to_priority: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TopicEventFragment>(topicEventFragment, {
    insertColumns: [
      "id",
      "topic_id",
      "actor_id",
      "topic_from_closed_at",
      "topic_to_closed_at",
      "topic_from_archived_at",
      "topic_to_archived_at",
      "topic_from_name",
      "topic_to_name",
      "message_task_due_date_message_id",
      "message_task_due_date_from_due_at",
      "message_task_due_date_to_due_at",
      "topic_from_priority",
      "topic_to_priority",
    ],
    teamScopeCondition: (teamId) => ({ topic: { team_id: { _eq: teamId } } }),
  }),
}).addConnections((topicEvent, { getEntity }) => {
  return {
    get actor() {
      return topicEvent.actor_id ? getEntity(userEntity).findById(topicEvent.actor_id) : null;
    },
    get topic() {
      return getEntity(topicEntity).findById(topicEvent.topic_id);
    },
    get message() {
      const messageId = topicEvent.message_task_due_date_message_id;

      if (!messageId) {
        return null;
      }

      return getEntity(messageEntity).findById(messageId);
    },
  };
});

export type TopicEventEntity = EntityByDefinition<typeof topicEventEntity>;
