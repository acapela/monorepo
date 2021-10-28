import { formatRelative } from "date-fns";
import { AnimateSharedLayout } from "framer-motion";
import { upperFirst } from "lodash";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";
import { Button } from "~ui/buttons/Button";
import { IconClock } from "~ui/icons";
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
  const tasks = message.tasks.query(allTasksInMessageFilter, sortCurrentUserInFront).all;

  if (!message.tasks.hasItems) {
    return null;
  }

  const firstTask = tasks[0];
  const displayedTasks = tasks.slice(0, COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);
  const collapsedTasks = tasks.slice(COUNT_OF_MESSAGES_DISPLAYED_BEFORE_COLLAPSING);

  return (
    <UIHolder data-test-message-tasks>
      <AnimateSharedLayout>
        <TaskDueDateSetter message={message}>
          <Button
            kind="secondary"
            icon={<IconClock />}
            iconAtStart
            data-tooltip={firstTask.due_at ? "Change due date" : "Add due date"}
          >
            {firstTask.due_at ? upperFirst(formatRelative(new Date(firstTask.due_at), new Date())) : null}
          </Button>
        </TaskDueDateSetter>
      </AnimateSharedLayout>

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
`;

const UITasks = styled.div<{}>`
  display: flex;
  flex-direction: row;
  ${theme.spacing.horizontalActions.asGap}
`;
