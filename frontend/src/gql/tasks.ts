import { gql } from "@apollo/client";

import { TaskBasicInfoFragment as TaskBasicInfoFragmentType, TasksQuery, TasksQueryVariables } from "~gql";

import { MessageBasicInfoFragment } from "./messages";
import { UserBasicInfoFragment } from "./user";
import { createFragment, createQuery } from "./utils";

export const TaskBasicInfoFragment = createFragment<TaskBasicInfoFragmentType>(
  () => gql`
    ${MessageBasicInfoFragment()}
    ${UserBasicInfoFragment()}

    fragment TaskBasicInfo on task {
      id
      user {
        ...UserBasicInfo
      }
      message {
        ...MessageBasicInfo
      }
      created_at
      done_at
    }
  `
);

export const [useTasksQuery] = createQuery<TasksQuery, TasksQueryVariables>(
  () => gql`
    ${TaskBasicInfoFragment()}

    query Tasks($limit: Int, $orderBy: [task_order_by!], $where: task_bool_exp) {
      tasks: task(where: $where, limit: $limit, order_by: $orderBy) {
        ...TaskBasicInfo
      }
    }
  `
);
