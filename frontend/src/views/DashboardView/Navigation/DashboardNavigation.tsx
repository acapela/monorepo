import { useSubscription } from "@apollo/client";
import gql from "graphql-tag";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RouteLink, routes } from "~frontend/router";
import { DashboardTasksSubscription, DashboardTasksSubscriptionVariables } from "~gql";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { IconPlusSquare } from "~ui/icons";
import { theme } from "~ui/theme";

import { DashboardTaskCard } from "./tasks/TaskCard";
import { TaskList } from "./tasks/TaskList";
import { TopicList } from "./topics/TopicList";

export function useDashboardTasks() {
  const currentUser = useAssertCurrentUser();
  const { data } = useSubscription<DashboardTasksSubscription, DashboardTasksSubscriptionVariables>(
    gql`
      ${DashboardTaskCard.fragments.task}

      subscription DashboardTasks($userId: uuid!) {
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
      <UISectionsHolder>
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
        <CollapsePanel headerNode={<UISectionTitle>Topics</UISectionTitle>}>
          <UISectionContent>
            <TopicList />
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

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
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
