import { RouteLink, routes } from "~frontend/router";
import { DashboardTaskCard_TaskFragment } from "~gql";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";

import { DashboardTaskCard } from "./TaskCard";

interface Props {
  tasks: DashboardTaskCard_TaskFragment[];
  hideUserInfo?: boolean;
}

export function TaskList({ tasks, hideUserInfo }: Props) {
  if (!tasks.length) {
    return <EmptyStatePlaceholder description="No tasks to show" />;
  }

  return (
    <>
      {tasks.map((task) => {
        return (
          <RouteLink key={task.id} passHref route={routes.dashboardTopic} params={{ topicId: task.message.topic.id }}>
            <a>
              <DashboardTaskCard task={task} hideUserInfo={hideUserInfo} />
            </a>
          </RouteLink>
        );
      })}
    </>
  );
}
