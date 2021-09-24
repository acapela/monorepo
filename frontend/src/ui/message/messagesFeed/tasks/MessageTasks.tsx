import styled from "styled-components";

import { MessageTask_TaskFragment } from "~gql";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: MessageTask_TaskFragment[];
  taskOwnerId: string;
  className?: string;
}

export const MessageTasks = styled(({ tasks, className, taskOwnerId }: Props) => (
  <UITasks className={className}>
    {tasks.map((task) => (
      <MessageTask key={task.id} task={task} taskOwnerId={taskOwnerId} />
    ))}
  </UITasks>
))``;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
