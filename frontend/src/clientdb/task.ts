import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { TaskFragment } from "~gql";

import { messageEntity } from "./message";
import { messageTaskDueDateEntity } from "./messageTaskDueDate";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const taskFragment = gql`
  fragment Task on task {
    id
    message_id
    user_id
    created_at
    done_at
    seen_at
    type
    updated_at
    message_task_due_date_id
  }
`;

export const taskEntity = defineEntity<TaskFragment>({
  name: "task",
  keyField: "id",
  updatedAtField: "updated_at",
  getDefaultValues() {
    return {
      __typename: "task",
      done_at: null,
      seen_at: null,
      message_task_due_date_id: null,
      ...getGenericDefaultData(),
    };
  },
  keys: getFragmentKeys<TaskFragment>(taskFragment),
  sync: createHasuraSyncSetupFromFragment<TaskFragment>(taskFragment, {
    insertColumns: ["done_at", "user_id", "seen_at", "type", "message_id", "id", "message_task_due_date_id"],
    updateColumns: ["done_at", "seen_at", "message_task_due_date_id"],
    teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
  }),
}).addConnections((task, { getEntity, getContextValue }) => {
  const connections = {
    get message() {
      return getEntity(messageEntity).findById(task.message_id);
    },
    get topic() {
      const message = getEntity(messageEntity).findById(task.message_id);

      if (!message) return null;

      return message.topic;
    },
    get hasDueDate() {
      return !!task.message_task_due_date_id;
    },
    get assignedUser() {
      if (!task.user_id) {
        return null;
      }

      return getEntity(userEntity).findById(task.user_id);
    },
    get creatingUser() {
      return connections.message?.user ?? null;
    },
    get isAssignedToSelf() {
      return task.user_id === getContextValue(userIdContext);
    },
    get isSelfCreated() {
      const createdByUserId = connections.creatingUser?.id;
      if (!createdByUserId) return false;
      return createdByUserId === getContextValue(userIdContext);
    },
    get isDone() {
      return !!task.done_at;
    },
    get dueDate() {
      const rawDueDate = task.message_task_due_date_id
        ? getEntity(messageTaskDueDateEntity).findById(task.message_task_due_date_id)?.due_date
        : null;

      return rawDueDate ? new Date(rawDueDate) : null;
    },
  };

  return connections;
});

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
