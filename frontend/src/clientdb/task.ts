import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { TaskFragment } from "@aca/gql";

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
      ...getGenericDefaultData(),
    };
  },
  keys: getFragmentKeys<TaskFragment>(taskFragment),
  sync: createHasuraSyncSetupFromFragment<TaskFragment>(taskFragment, {
    insertColumns: ["done_at", "user_id", "seen_at", "type", "message_id", "id"],
    updateColumns: ["done_at", "seen_at"],
    teamScopeCondition: (teamId) => ({ message: { topic: { team_id: { _eq: teamId } } } }),
  }),
})
  .addConnections((task, { getEntity, getContextValue }) => {
    const message = getEntity(messageEntity).findById(task.message_id);
    const connections = {
      get message() {
        return message;
      },
      get topic() {
        const message = getEntity(messageEntity).findById(task.message_id);

        if (!message) return null;

        return message.topic;
      },
      get hasDueDate() {
        return !!connections.message?.dueDate;
      },
      get dueDate() {
        return connections.message?.dueDate;
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
      get isSeen() {
        return !!task.seen_at;
      },
    };

    return connections;
  })
  .addEventHandlers({
    itemUpdated: (task, taskBefore) => {
      if (task.isDone && !taskBefore.done_at && task.message?.is_first_completion_enough) {
        task.message?.topic?.close();
      }
    },
  });

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
