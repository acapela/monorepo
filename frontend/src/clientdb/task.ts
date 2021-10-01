import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  PushUpdateTaskMutation,
  PushUpdateTaskMutationVariables,
  TaskFragment,
  Task_Insert_Input,
  Task_Set_Input,
  UpdatedTasksQuery,
  UpdatedTasksQueryVariables,
} from "~gql";

import { userIdContext } from "./context";
import { messageEntity } from "./message";
import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

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
  }
`;

const [, { subscribe: subscribeToMessageUpdates }] = createQuery<UpdatedTasksQuery, UpdatedTasksQueryVariables>(
  () => gql`
    ${taskFragment}

    query UpdatedTasks($lastSyncDate: timestamptz) {
      task(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...Task
      }
    }
  `
);

const [, { mutate: updateTask }] = createMutation<PushUpdateTaskMutation, PushUpdateTaskMutationVariables>(
  () => gql`
    ${taskFragment}
    mutation PushUpdateTask($input: task_insert_input!) {
      insert_task_one(
        object: $input
        on_conflict: { constraint: task_pkey, update_columns: [done_at, due_at, seen_at, type, user_id] }
      ) {
        ...Task
      }
    }
  `
);

function convertChangedDataToInput({
  done_at,
  user_id,
  seen_at,
  type,
  message_id,
  id,
}: Partial<TaskFragment>): Task_Insert_Input {
  return { done_at, user_id, seen_at, type, message_id, id };
}

export const taskEntity = defineEntity<TaskFragment>({
  name: "task",
  keyField: "id",
  updatedAtField: "updated_at",
  getDefaultValues() {
    return {
      __typename: "task",
      ...getGenericDefaultData(),
    };
  },
  keys: getFragmentKeys<TaskFragment>(taskFragment),
  sync: {
    pull({ lastSyncDate, updateItems }) {
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.task);
      });
    },
    async push(task) {
      const result = await updateTask({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((task, { getEntity, getContext }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(task.message_id);
    },
    get user() {
      if (!task.user_id) {
        return null;
      }

      return getEntity(userEntity).findById(task.user_id);
    },
    get isOwn() {
      return task.user_id === getContext(userIdContext);
    },
  };
});

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
