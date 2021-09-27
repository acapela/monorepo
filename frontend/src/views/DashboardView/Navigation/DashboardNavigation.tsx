import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { RouteLink, routes } from "~frontend/router";
import { Button } from "~ui/buttons/Button";
import { CollapsePanel } from "~ui/collapse/CollapsePanel";
import { IconPlusSquare } from "~ui/icons";
import { theme } from "~ui/theme";

import { TaskList } from "./tasks/TaskList";
import { useTasksSubscription } from "./tasks/useTasksSubscription";
import { TopicList } from "./topics/TopicList";
import { useDashboardOpenTopics } from "./topics/useDashboardOpenTopics";

export function useDashboardTasks() {
  const currentUser = useAssertCurrentUser();
  const { tasks } = useTasksSubscription();

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
