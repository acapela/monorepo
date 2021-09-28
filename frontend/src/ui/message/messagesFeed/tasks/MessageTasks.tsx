import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { MessageTask_TaskFragment } from "~gql";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown } from "~ui/icons";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: MessageTask_TaskFragment[];
  taskOwnerId: string;
  className?: string;
}

export const MessageTasks = styled(({ tasks, className, taskOwnerId }: Props) => {
  const currentUser = useAssertCurrentUser();
  const isCurrentUserOwner = taskOwnerId === currentUser?.id;
  return (
    <UIHolder>
      <UITasks className={className}>
        {tasks.map((task) => (
          <MessageTask key={task.id} task={task} />
        ))}
      </UITasks>
      {isCurrentUserOwner && tasks.length > 0 && (
        <UITaskOwnerActions>
          <AnimateSharedLayout>
            <TaskDueDateSetter messageId={tasks[0].message_id}>
              <Button kind="secondary" key="add-filter" icon={<IconChevronDown />}>
                Add due date
              </Button>
            </TaskDueDateSetter>
          </AnimateSharedLayout>
        </UITaskOwnerActions>
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const UITaskOwnerActions = styled.div<{}>``;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
