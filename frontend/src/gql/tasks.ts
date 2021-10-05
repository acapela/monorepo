import { gql } from "@apollo/client";

import {
  TaskBasicInfoFragment as TaskBasicInfoFragmentType,
  TaskDetailedInfoFragment as TaskDetailedInfoFragmentType,
  TasksQuery,
  TasksQueryVariables,
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
} from "~gql";

import { MessageBasicInfoFragment } from "./messages";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createMutation, createQuery } from "./utils";

export const TaskBasicInfoFragment = createFragment<TaskBasicInfoFragmentType>(
  () => gql`
    fragment TaskBasicInfo on task {
      id
      user_id
      message_id
      created_at
      seen_at
      due_at
      done_at
      type
    }
  `
);

export const TaskDetailedInfoFragment = createFragment<TaskDetailedInfoFragmentType>(
  () => gql`
    ${MessageBasicInfoFragment()}
    ${UserBasicInfoFragment()}
    ${TaskBasicInfoFragment()}

    fragment TaskDetailedInfo on task {
      ...TaskBasicInfo
      user {
        ...UserBasicInfo
      }
      message {
        ...MessageBasicInfo
        topic {
          id
          name
        }
      }
    }
  `
);

export const [useTasksQuery] = createQuery<TasksQuery, TasksQueryVariables>(
  () => gql`
    ${TaskDetailedInfoFragment()}

    query Tasks($limit: Int, $orderBy: [task_order_by!], $where: task_bool_exp) {
      tasks: task(where: $where, limit: $limit, order_by: $orderBy) {
        ...TaskDetailedInfo
      }
    }
  `
);

export const [, { mutate: updateTask }] = createMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(
  () => gql`
    ${TaskBasicInfoFragment()}

    mutation UpdateTask($taskId: uuid!, $input: task_set_input!) {
      update_task_by_pk(pk_columns: { id: $taskId }, _set: $input) {
        ...TaskBasicInfo
      }
    }
  `
);
