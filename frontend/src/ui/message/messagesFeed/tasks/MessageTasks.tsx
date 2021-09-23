import styled from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { MessageTask_TaskFragment } from "~gql";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: MessageTask_TaskFragment[];
  taskOwnerId: string;
  className?: string;
}

export const MessageTasks = styled(function MessageTasks({ tasks, className, taskOwnerId }: Props) {
  const allTeamMembers = useCurrentTeamMembers();
  return (
    <UITasks className={className}>
      {tasks.map((task) => (
        <MessageTask
          key={task.id}
          task={task}
          taskAssignee={allTeamMembers.find((member) => member.id === task.user_id) ?? null}
          taskOwnerId={taskOwnerId}
        />
      ))}
    </UITasks>
  );
})``;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
