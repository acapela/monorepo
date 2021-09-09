import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import { TaskFragment, UpdatedTasksQuery, UpdatedTasksQueryVariables } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { messageEntity } from "./message";
import { userEntity } from "./user";

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

export const taskEntity = defineEntity<TaskFragment>({
  name: "task",
  keyField: "id",
  updatedAtField: "updated_at",
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      console.log("pull messages");
      return subscribeToMessageUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.task);
      });
    },
  },
}).addConnections((task, { getEntity }) => {
  return {
    get message() {
      return getEntity(messageEntity).findById(task.message_id);
    },
    get user() {
      return getEntity(userEntity).findById(task.user_id);
    },
    get isOwn() {
      // TODOC
      return false;
    },
  };
});

export type TaskEntity = EntityByDefinition<typeof taskEntity>;
