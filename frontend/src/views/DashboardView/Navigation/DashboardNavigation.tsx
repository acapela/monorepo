import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { DashboardTasksQuery, DashboardTasksQueryVariables } from "~gql";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { theme } from "~ui/theme";

import { DashboardTaskCard } from "./tasks/TaskCard";
import { TaskList } from "./tasks/TaskList";

export function useDashboardTasks() {
  const currentUser = useAssertCurrentUser();
  const { data } = useQuery<DashboardTasksQuery, DashboardTasksQueryVariables>(
    gql`
      ${DashboardTaskCard.fragments.task}

      query DashboardTasks($userId: uuid!) {
        task(
          where: {
            done_at: { _is_null: true }
            _or: [{ user_id: { _eq: $userId } }, { message: { user_id: { _eq: $userId } } }]
          }
        ) {
          ...DashboardTaskCard_task
          user_id
          message {
            user_id
          }
        }
      }
    `,
    { variables: { userId: currentUser.id } }
  );

  const openTasksRelatedToUser = data?.task ?? [];

  const receivedTasks = openTasksRelatedToUser.filter((task) => {
    return task.user_id === currentUser.id;
  });

  const sentTasks = openTasksRelatedToUser.filter((task) => {
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

  return (
    <UIHolder>
      <CollapsePanel isInitiallyOpen headerNode={<UISectionTitle>Received Requests</UISectionTitle>}>
        <UISectionContent>
          <TaskList tasks={receivedTasks} hideUserInfo />
        </UISectionContent>
      </CollapsePanel>
      <CollapsePanel headerNode={<UISectionTitle>Sent Requests</UISectionTitle>}>
        <UISectionContent>
          <TaskList tasks={sentTasks} />
        </UISectionContent>
      </CollapsePanel>
    </UIHolder>
  );
}

const UIHolder = styled.div``;

const UISectionTitle = styled.h3`
  ${theme.font.h4.spezia.semibold.build()};
`;

const UISectionContent = styled.div`
  padding: 16px 0;
`;
