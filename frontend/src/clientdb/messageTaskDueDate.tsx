import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { MessageTaskDueDateFragment } from "@aca/gql";

import { messageEntity } from "./message";
import { TopicEntity } from "./topic";
import { topicEventEntity } from "./topicEvent";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const messageTaskDueDateFragment = gql`
  fragment MessageTaskDueDate on message_task_due_date {
    id
    message_id
    due_at
    created_at
    updated_at
  }
`;

export const messageTaskDueDateEntity = defineEntity<MessageTaskDueDateFragment>({
  name: "message_task_due_date",
  updatedAtField: "updated_at",
  keyField: "id",
  uniqueIndexes: ["id", "message_id"],
  keys: getFragmentKeys<MessageTaskDueDateFragment>(messageTaskDueDateFragment),
  defaultSort: (event) => new Date(event.created_at).getTime(),
  getDefaultValues: () => ({
    __typename: "message_task_due_date",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<MessageTaskDueDateFragment>(messageTaskDueDateFragment, {
    insertColumns: ["id", "message_id", "due_at", "created_at", "updated_at"],
    updateColumns: ["due_at"],
    teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
  }),
})
  .addConnections((messageTaskDueDate, { getEntity }) => {
    return {
      get topic() {
        return getEntity(messageEntity).assertFindById(messageTaskDueDate.message_id).topic as TopicEntity;
      },
    };
  })
  .addEventHandlers({
    itemAdded: (dueDateModel, { getEntity }) => {
      getEntity(topicEventEntity).create({
        topic_id: dueDateModel.topic.id,
        message_task_due_date_message_id: dueDateModel.message_id,
        message_task_due_date_from_due_at: null,
        message_task_due_date_to_due_at: dueDateModel.due_at,
      });
    },
    itemUpdated: (dueDateModelNow, dueDateModelBefore, { getEntity }) => {
      getEntity(topicEventEntity).create({
        topic_id: dueDateModelNow.topic.id,
        message_task_due_date_message_id: dueDateModelNow.message_id,
        message_task_due_date_from_due_at: dueDateModelBefore.due_at,
        message_task_due_date_to_due_at: dueDateModelNow.due_at,
      });
    },
    itemRemoved: (removedDueDateModel, { getEntity }) => {
      getEntity(topicEventEntity).create({
        topic_id: removedDueDateModel.topic.id,
        message_task_due_date_message_id: removedDueDateModel.message_id,
        message_task_due_date_from_due_at: removedDueDateModel.due_at,
        message_task_due_date_to_due_at: null,
      });
    },
  });

export type MessageTaskDueDateEntity = EntityByDefinition<typeof messageTaskDueDateEntity>;
