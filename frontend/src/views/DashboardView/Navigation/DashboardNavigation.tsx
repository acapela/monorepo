import { gql } from "@apollo/client";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useQueryItemsWithUpdates } from "~frontend/gql/utils/useQueryItemsWithUpdates";
import { RouteLink, routes } from "~frontend/router";
import { DashboardTaskCard } from "~frontend/views/DashboardView/Navigation/tasks/TaskCard";
import {
  DashboardTaskExistenceSubscription,
  DashboardTaskExistenceSubscriptionVariables,
  DashboardTasksQuery,
  DashboardTasksQueryVariables,
  DashboardTasksUpdatesSubscription,
  DashboardTasksUpdatesSubscriptionVariables,
} from "~gql";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { IconPlusSquare } from "~ui/icons";
import { theme } from "~ui/theme";

import { TaskList } from "./tasks/TaskList";
import { TopicList } from "./topics/TopicList";
import { useDashboardOpenTopics } from "./topics/useDashboardOpenTopics";

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

export function useTasksWithUpdates() {
  const currentUser = useAssertCurrentUser();

  const { items: tasks } = useQueryItemsWithUpdates<
    "tasks",
    DashboardTasksQuery,
    DashboardTasksQueryVariables,
    DashboardTasksUpdatesSubscription,
    DashboardTasksUpdatesSubscriptionVariables,
    DashboardTaskExistenceSubscription,
    DashboardTaskExistenceSubscriptionVariables
  >({
    queryDocument: gql`
      ${TASK_FRAGMENT}

      query DashboardTasks($tasksFilter: task_bool_exp!) {
        tasks: task(where: $tasksFilter) {
          ...DashboardNavigationTask_task
        }
      }
    `,
    updateSubscriptionDocument: gql`
      ${TASK_FRAGMENT}

      subscription DashboardTasksUpdates($lastUpdatedAt: timestamptz!, $tasksFilter: task_bool_exp!) {
        tasks: task(where: { _and: [{ updated_at: { _gt: $lastUpdatedAt } }, $tasksFilter] }) {
          ...DashboardNavigationTask_task
        }
      }
    `,
    existenceSubscriptionDocument: gql`
      subscription DashboardTaskExistence($tasksFilter: task_bool_exp!) {
        tasks: task(where: $tasksFilter) {
          id
        }
      }
    `,
    variables: {
      tasksFilter: {
        done_at: { _is_null: true },
        _or: [{ user_id: { _eq: currentUser.id } }, { message: { user_id: { _eq: currentUser.id } } }],
      },
    },
    itemsKey: "tasks",
  });

  return tasks;
}

export function useDashboardTasks() {
  const currentUser = useAssertCurrentUser();
  const tasks = useTasksWithUpdates();

  const receivedTasks = tasks.filter((task) => {
    return task.user_id === currentUser.id;
  });

  const sentTasks = tasks.filter((task) => {
    // If user has assigned some task to self - it is technically both sent and received. In such case we only show is at received.
    // There is no UX point in showing it as sent as you're not kinda waiting for info from yourself about the status of it.
    if (task.user_id === currentUser.id) return false;

    return task.message.user_id === currentUser.id;
  });

  return {
    receivedTasks,
    sentTasks,
  };
}

export function DashboardNavigation() {
  const { receivedTasks, sentTasks } = useDashboardTasks();
  const openTopics = useDashboardOpenTopics();

  return (
    <UIHolder>
      <UISectionsHolder>
        <CollapsePanel isInitiallyOpen headerNode={<UISectionTitle>Received Requests</UISectionTitle>}>
          <UISectionContent>
            <UIListHolder>
              <TaskList tasks={receivedTasks} hideUserInfo />
            </UIListHolder>
          </UISectionContent>
        </CollapsePanel>
        <CollapsePanel headerNode={<UISectionTitle>Sent Requests</UISectionTitle>}>
          <UISectionContent>
            <UIListHolder>
              <TaskList tasks={sentTasks} />
            </UIListHolder>
          </UISectionContent>
        </CollapsePanel>
        <CollapsePanel headerNode={<UISectionTitle>Open Topics</UISectionTitle>}>
          <UISectionContent>
            <UIListHolder>
              <TopicList topics={openTopics} />
            </UIListHolder>
          </UISectionContent>
        </CollapsePanel>
      </UISectionsHolder>

      <UINewTopicButtonHolder>
        <RouteLink route={routes.dashboardNewTopic} params={{}}>
          <a>
            <Button kind="secondary" icon={<IconPlusSquare />} iconPosition="start">
              New Topic
            </Button>
          </a>
        </RouteLink>
      </UINewTopicButtonHolder>
    </UIHolder>
  );
}

const UIListHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto;
`;

const UISectionsHolder = styled.div`
  flex-grow: 1;
`;

const UISectionTitle = styled.h3`
  ${theme.font.h4.spezia.semibold.build()};
`;

const UISectionContent = styled.div`
  padding: 16px 0;
`;

const UINewTopicButtonHolder = styled.div`
  display: flex;
  justify-content: center;
`;
