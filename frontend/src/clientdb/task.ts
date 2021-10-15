import gql from "graphql-tag";
import { max } from "lodash";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { TaskFragment } from "~gql";

import { messageEntity } from "./message";
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
    due_at
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
      due_at: null,
      ...getGenericDefaultData(),
    };
  },
  keys: getFragmentKeys<TaskFragment>(taskFragment),
  sync: createHasuraSyncSetupFromFragment<TaskFragment>(taskFragment, {
    insertColumns: ["done_at", "due_at", "user_id", "seen_at", "type", "message_id", "id"],
    updateColumns: ["done_at", "due_at", "seen_at"],
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
    get assignedUser() {
      if (!task.user_id) {
        return null;
      }

      return getEntity(userEntity).findById(task.user_id);
    },
    get creatingUser() {
      return connections.message?.user ?? null;
    },
    get lastActivityDate() {
      if (!task.done_at) {
        return new Date(task.created_at);
      }

      // Note - we cannot base on 'updated_at' because 'seen_at' is set automatically when you see the topic
      // as updating seen_at is update, it will also push 'updated_at' on server side.

      // Product wise - we can consider 'activity' as explicit action on the task
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return max([new Date(task.done_at), new Date(task.created_at)])!;
    },
    get lastOwnActivityDate() {
      if (connections.isAssignedToSelf) {
        if (task.done_at) {
          return new Date(task.done_at);
        }
      }

      if (connections.isSelfCreated) {
        return new Date(task.created_at);
      }

      return null;
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
      return Boolean(task.done_at);
    },
  };

  return connections;
});

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
