import styled from "styled-components";

import { DashboardTaskCard_TaskFragment } from "~frontend/../../gql";
import { EmptyStatePlaceholder } from "~frontend/../../ui/empty/EmptyStatePlaceholder";

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
    <UITasksHolder>
      {tasks.map((task) => {
        return <DashboardTaskCard key={task.id} task={task} hideUserInfo={hideUserInfo} />;
      })}
    </UITasksHolder>
  );
}

const UITasksHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
