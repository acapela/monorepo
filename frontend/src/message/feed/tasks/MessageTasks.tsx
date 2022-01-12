import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { MessageEntity } from "@aca/frontend/clientdb/message";
import { TaskEntity } from "@aca/frontend/clientdb/task";
import { OwnTaskCompletionButton } from "@aca/frontend/tasks/OwnTaskCompletionButton";
import { TaskDueDateSetter } from "@aca/frontend/tasks/TaskDueDateSetter";
import { styledObserver } from "@aca/shared/component";
import { groupByFilter } from "@aca/shared/groupByFilter";
import { MENTION_TYPE_LABELS, RequestType } from "@aca/shared/requests";
import { theme } from "@aca/ui/theme";

import { MessageTasksPeople } from "./MessageTasksPeople";

interface Props {
  message: MessageEntity;
}

const sortCurrentUserInFront = (item: TaskEntity) => (item.isAssignedToSelf ? -1 : 0);

export const MessageTasks = styledObserver(({ message }: Props) => {
  if (!message.tasks.hasItems) {
    return null;
  }

  const sortedTasks = message.tasks.sort(sortCurrentUserInFront).all;

  const [completedTasks, pendingTasks] = groupByFilter(sortedTasks, (task) => task.isDone);

  const selfTask = sortedTasks.find((task) => task.isAssignedToSelf);

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
            {pendingTasks.length > 0 && (
              <MessageTasksPeople
                tasks={pendingTasks}
                label={
                  completedTasks.length == 0 && message.is_first_completion_enough
                    ? "Waiting for 1st " + MENTION_TYPE_LABELS[pendingTasks[0].type as RequestType]
                    : "Pending"
                }
              />
            )}
            {completedTasks.length > 0 && <MessageTasksPeople tasks={completedTasks} label="✓ Completed" isPrimary />}
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
  ${theme.spacing.actions.asGap};
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
