import { AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskEntity } from "~frontend/clientdb/task";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";
import { Button } from "~ui/buttons/Button";
import { IconChevronDown } from "~ui/icons";

import { MessageTask } from "./MessageTask";

interface Props {
  tasks: TaskEntity[];
  taskOwnerId: string;
  className?: string;
}

export const MessageTasks = styledObserver(({ tasks, className, taskOwnerId }: Props) => {
  const currentUser = useAssertCurrentUser();
  const isCurrentUserOwner = taskOwnerId === currentUser?.id;
  const hasTasks = tasks.length > 0;
  const isDueDateSet = hasTasks && !!tasks[0].due_at;

  return (
    <UIHolder>
      <UITasks className={className}>
        {tasks.map((task) => (
          <MessageTask key={task.id} task={task} />
        ))}
      </UITasks>
      {isCurrentUserOwner && hasTasks && (
        <UITaskOwnerActions>
          <AnimateSharedLayout>
            <TaskDueDateSetter messageId={tasks[0].message_id} previousDueDate={tasks[0].due_at}>
              <Button kind="secondary" key="add-filter" icon={<IconChevronDown />}>
                {isDueDateSet ? "Change due date" : "Add due date"}
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
