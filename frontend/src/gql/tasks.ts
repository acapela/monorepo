import { gql } from "@apollo/client";

import {
  TaskBasicInfoFragment as TaskBasicInfoFragmentType,
  TaskDetailedInfoFragment as TaskDetailedInfoFragmentType,
  TasksQuery,
  TasksQueryVariables,
} from "~gql";

import { MessageBasicInfoFragment } from "./messages";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createQuery } from "./utils";

export const TaskBasicInfoFragment = createFragment<TaskBasicInfoFragmentType>(
  () => gql`
    fragment TaskBasicInfo on task {
      id
      user_id
      message_id
      created_at
      done_at
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
