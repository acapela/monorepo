import styled from "styled-components";

import { useCurrentTeamMembers } from "~frontend/gql/teams";
import { TaskBasicInfoFragment } from "~gql";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: TaskBasicInfoFragment[];
  className?: string;
}

export const MessageTasks = styled(function MessageTasks({ tasks, className }: Props) {
  const allTeamMembers = useCurrentTeamMembers();
  return (
    <UITasks className={className}>
      {tasks.map((task) => {
        const taskAssignee = allTeamMembers.find((member) => member.id === task.user_id);

        if (!taskAssignee) {
          return;
        }

        return <MessageTask task={task} taskAssignee={taskAssignee} />;
      })}
    </UITasks>
  );
})``;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
