import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { MessageTaskDueDateFragment } from "~gql";

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
});

export type MessageTaskDueDateEntity = EntityByDefinition<typeof messageTaskDueDateEntity>;
