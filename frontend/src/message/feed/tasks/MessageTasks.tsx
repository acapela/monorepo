import { LayoutGroup } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { OwnTaskCompletionButton } from "~frontend/tasks/OwnTaskCompletionButton";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";
import { theme } from "~ui/theme";

import { CollapsedTasksButton } from "./CollapsedTasksButton";
import { MessageTask } from "./MessageTask";

interface Props {
  message: MessageEntity;
}

const COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING = 3;

const allTasksInMessageFilter = () => true;

const sortCurrentUserInFront = (item: TaskEntity) => (item.assignedUser?.isCurrentUser ? -1 : 0);

export const MessageTasks = styledObserver(({ message }: Props) => {
  const tasks = message.tasks.query(allTasksInMessageFilter, sortCurrentUserInFront);

  const allTasks = tasks.all;

  if (!message.tasks.hasItems) {
    return null;
  }

  const displayedTasks = allTasks.slice(0, COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);
  const collapsedTasks = allTasks.slice(COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);

  const selfTask = tasks.query({ isAssignedToSelf: true }).first;

  return (
    <UIHolder data-test-message-tasks>
      <LayoutGroup>
        {selfTask && <OwnTaskCompletionButton task={selfTask} />}
        <TaskDueDateSetter message={message} />
      </LayoutGroup>

      <UIDivider />

      <UITasksPossibleScroller>
        <UITasks>
          {displayedTasks.map((task) => (
            <MessageTask key={task.id} task={task} />
          ))}
        </UITasks>

        {collapsedTasks.length > 0 && <CollapsedTasksButton tasks={collapsedTasks} />}
      </UITasksPossibleScroller>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  overflow-y: hidden;
`;

const UIDivider = styled.div<{}>`
  width: 1px;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.05);
`;

const UITasksPossibleScroller = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 0;
  overflow-x: auto;
  ${theme.spacing.actions.asGap}
`;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: row;
  ${theme.spacing.actions.asGap}
`;
