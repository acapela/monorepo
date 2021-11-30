import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { TaskEntity } from "~frontend/clientdb/task";
import { OwnTaskCompletionButton } from "~frontend/tasks/OwnTaskCompletionButton";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "~shared/component";
import { groupByFilter } from "~shared/groupByFilter";
import { theme } from "~ui/theme";

import { MessageTasksPeople } from "./MessageTasksPeople";

interface Props {
  message: MessageEntity;
}

const allTasksInMessageFilter = () => true;

const sortCurrentUserInFront = (item: TaskEntity) => (item.assignedUser?.isCurrentUser ? -1 : 0);

export const MessageTasks = styledObserver(({ message }: Props) => {
  const tasks = message.tasks.query(allTasksInMessageFilter, sortCurrentUserInFront);

  const allTasks = tasks.all;

  const [completedTasks, pendingTasks] = groupByFilter(allTasks, (task) => task.isDone);

  if (!message.tasks.hasItems) {
    return null;
  }

  const selfTask = tasks.query({ isAssignedToSelf: true }).first;

  return (
    <UIHolder data-test-message-tasks>
      <LayoutGroup>
        {selfTask && <OwnTaskCompletionButton task={selfTask} />}
        <TaskDueDateSetter
          dueDate={message.dueDate}
          onChange={message.setTasksDueDate}
          isDisabled={message.topic?.isClosed}
        />

        <UIDivider />

        <UIParticipantsGroups layout="position">
          <AnimatePresence>
            {pendingTasks.length > 0 && <MessageTasksPeople tasks={pendingTasks} label="Pending" />}
            {completedTasks.length > 0 && <MessageTasksPeople tasks={completedTasks} label="Done" isPrimary />}
          </AnimatePresence>
        </UIParticipantsGroups>
      </LayoutGroup>
    </UIHolder>
  );
})``;

const UIHolder = styled.div<{}>`
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.actions.asGap}
  overflow-y: hidden;
`;

const UIDivider = styled.div<{}>`
  width: 1px;
  align-self: stretch;
  ${theme.colors.layout.divider.asBg};
  margin: 0 5px;
`;

const UIParticipantsGroups = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${theme.spacing.sections.asGap}
`;
