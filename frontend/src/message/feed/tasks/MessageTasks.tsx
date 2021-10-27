import { AnimateSharedLayout } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";

import { CollapsedTasksButton } from "./CollapsedTasksButton";
import { MessageTask } from "./MessageTask";

interface Props {
  message: MessageEntity;
}

const COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING = 3;

const allTasksInMessageFilter = () => true;

const sortCurrentUserInFront = (item: TaskEntity) => (item.assignedUser?.isCurrentUser ? -1 : 0);

export const MessageTasks = styledObserver(({ message }: Props) => {
  const tasks = message.tasks.query(allTasksInMessageFilter, sortCurrentUserInFront).all;

  if (!message.tasks.hasItems) {
    return null;
  }

  const displayedTasks = tasks.slice(0, COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);
  const collapsedTasks = tasks.slice(COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);

  return (
    <UIHolder data-test-message-tasks>
      <AnimateSharedLayout>
        <TaskDueDateSetter message={message} />
      </AnimateSharedLayout>

      <UIDivider />

      <UITasks>
        {displayedTasks.map((task) => (
          <MessageTask key={task.id} task={task} />
        ))}
      </UITasks>

      {collapsedTasks.length > 0 && <CollapsedTasksButton tasks={collapsedTasks} />}
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const UIDivider = styled.div<{}>`
  width: 1px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
