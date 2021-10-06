import { observer } from "mobx-react";
import styled, { css } from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { TaskDueDateSetter } from "~frontend/tasks/TaskDueDateSetter";
import { relativeFormatDateTime } from "~shared/dates/format";
import { IconFlag } from "~ui/icons";
import { theme } from "~ui/theme";

export const TopicHeaderDueDate = observer(({ topic }: { topic: TopicEntity }) => {
  const currentUser = useCurrentUser();

  const message = topic.messages.all[0];
  const firstMessageTasks = message ? message.tasks.all : [];

  if (message === null || firstMessageTasks.length === 0) {
    return null;
  }

  const isTaskOwner = message.user_id === currentUser?.id;
  const previousDueDate = firstMessageTasks[0].due_at;
  const formattedDueDate = previousDueDate ? relativeFormatDateTime(new Date(previousDueDate as string)) : null;

  return (
    <UIDueDateSection>
      <IconFlag />

      {formattedDueDate && !isTaskOwner && <UIDueDate>{formattedDueDate}</UIDueDate>}
      {formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter messageId={message.id} previousDueDate={previousDueDate}>
          <UIDueDate isClickable>{formattedDueDate}</UIDueDate>
        </TaskDueDateSetter>
      )}

      {!formattedDueDate && !isTaskOwner && <UIDueDate>No due date</UIDueDate>}
      {!formattedDueDate && isTaskOwner && (
        <TaskDueDateSetter messageId={message.id}>
          <UIDueDate isClickable>Add due date</UIDueDate>
        </TaskDueDateSetter>
      )}
    </UIDueDateSection>
  );
});

const UIDueDateSection = styled.div<{}>`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;

  svg {
    color: ${theme.colors.status.warning()};
  }

  cursor: default;
`;

const UIDueDate = styled.div<{ isClickable?: boolean }>`
  ${theme.font.body12.spezia.build()}

  ${(props) =>
    props.isClickable &&
    css`
      white-space: nowrap;
      cursor: pointer;
      text-decoration: underline;
    `}
`;
