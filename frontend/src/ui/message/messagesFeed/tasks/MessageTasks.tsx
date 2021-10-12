import { formatRelative } from "date-fns";
import { AnimateSharedLayout } from "framer-motion";
import { noop } from "lodash";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";
import { Button } from "~ui/buttons/Button";
import { IconClock } from "~ui/icons";

import { MessageTask } from "./MessageTask";

interface Props {
  message: MessageEntity;
}

export const MessageTasks = styledObserver(({ message }: Props) => {
  const tasks = message.tasks.all;
  const firstTask = tasks[0];

  if (!firstTask) {
    return null;
  }

  return (
    <UIHolder>
      <AnimateSharedLayout>
        <TaskDueDateSetter task={firstTask}>
          <Button
            kind="secondary"
            icon={<IconClock />}
            iconPosition="start"
            size="medium"
            data-tooltip={firstTask.due_at ? "Change due date" : "Add due date"}
            onClick={noop /* Required to make the button look clickable */}
          >
            {firstTask.due_at ? formatRelative(new Date(firstTask.due_at), new Date()) : null}
          </Button>
        </TaskDueDateSetter>
      </AnimateSharedLayout>

      <UIDivider />

      <UITasks>
        {tasks.map((task) => (
          <MessageTask key={task.id} task={task} />
        ))}
      </UITasks>
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
