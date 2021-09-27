import { gql, useApolloClient, useQuery, useSubscription } from "@apollo/client";
import _ from "lodash";
import { useEffect, useMemo } from "react";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import {
  DashboardTasksQuery,
  DashboardTasksQueryVariables,
  NewDashboardTasksSubscription,
  NewDashboardTasksSubscriptionVariables,
  TaskExistenceSubscription,
  TaskExistenceSubscriptionVariables,
  Task_Bool_Exp,
} from "~gql";

import { DashboardTaskCard } from "./TaskCard";

const TASK_FRAGMENT = gql`
  ${DashboardTaskCard.fragments.task}
  fragment DashboardNavigationTask_task on task {
    ...DashboardTaskCard_task
    user_id
    message {
      user_id
    }
    updated_at
  }
`;

const TASKS_QUERY = gql`
  ${TASK_FRAGMENT}

  query DashboardTasks($tasksFilter: task_bool_exp!) {
    tasks: task(where: $tasksFilter) {
      ...DashboardNavigationTask_task
    }
  }
`;

const getTasksFilter = (userId: string): Task_Bool_Exp => ({
  done_at: { _is_null: true },
  _or: [{ user_id: { _eq: userId } }, { message: { user_id: { _eq: userId } } }],
});

// Update our tasks cache when a task gets deleted
function useExistingTasksSubscription(tasksFilter: Task_Bool_Exp) {
  const { data } = useSubscription<TaskExistenceSubscription, TaskExistenceSubscriptionVariables>(
    gql`
      subscription TaskExistence($tasksFilter: task_bool_exp) {
        existingTasks: task(where: $tasksFilter) {
          id
        }
      }
    `,
    { variables: { tasksFilter } }
  );
  const existingTaskIds = useMemo(() => (data ? new Set(data.existingTasks.map((t) => t.id)) : null), [data]);

  const client = useApolloClient();

  useEffect(() => {
    if (!existingTaskIds) {
      return;
    }
    const options = {
      query: TASKS_QUERY,
      variables: { tasksFilter },
    };
    const data = client.readQuery<DashboardTasksQuery, DashboardTasksQueryVariables>(options);
    if (data) {
      client.writeQuery({
        ...options,
        data: {
          ...data,
          tasks: data.tasks.filter((t) => existingTaskIds.has(t.id)),
        },
      });
    }
  }, [client, existingTaskIds, tasksFilter]);

  return existingTaskIds;
}

export function useTasksSubscription() {
  const currentUser = useAssertCurrentUser();
  const tasksFilter = getTasksFilter(currentUser.id);

  const { data, subscribeToMore } = useQuery<DashboardTasksQuery, DashboardTasksQueryVariables>(TASKS_QUERY, {
    variables: { tasksFilter },
  });

  useExistingTasksSubscription(tasksFilter);
  const tasks = data?.tasks ?? [];

  const lastUpdatedAt = useMemo(() => (data ? _.max(data.tasks.map((t) => t.updated_at)) : null), [data]);

  useEffect(() => {
    if (!lastUpdatedAt) {
      return;
    }
    return subscribeToMore<NewDashboardTasksSubscription, NewDashboardTasksSubscriptionVariables>({
      document: gql`
        ${TASK_FRAGMENT}

        subscription NewDashboardTasks($tasksFilter: task_bool_exp!) {
          tasks: task(where: $tasksFilter) {
            ...DashboardNavigationTask_task
          }
        }
      `,
      variables: { tasksFilter: { ...tasksFilter, updated_at: { _gt: lastUpdatedAt } } },
      updateQuery(prev, { subscriptionData }) {
        const updatedTasks = subscriptionData.data.tasks;

        const existingTaskIds = new Set(prev.tasks.map((t) => t.id));
        const newTasks = updatedTasks.filter((t) => !existingTaskIds.has(t.id));

        return {
          ...prev,
          tasks: [...prev.tasks, ...newTasks],
        };
      },
    });
  }, [lastUpdatedAt, subscribeToMore, tasksFilter]);

  return { tasks };
}
