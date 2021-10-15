import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { niceFormatDateTime } from "~shared/dates/format";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

const TASK_TYPE_LABELS = new Map(
  Object.entries({
    "request-read": "Confirmation",
    "request-response": "Feedback",
  })
);

export const MessageTask = observer(({ task }: Props) => {
  function getTooltip() {
    if (task.done_at) {
      return `Done ${niceFormatDateTime(new Date(task.done_at))}`;
    }

    if (task.seen_at) {
      return `Seen ${niceFormatDateTime(new Date(task.seen_at))}`;
    }

    return `Not seen yet`;
  }
  return (
    <UISingleTask key={task.id} data-tooltip={getTooltip()}>
      {task.assignedUser ? <UserAvatar size={30} user={task.assignedUser} /> : <Avatar name="?" />}
      <UITextInfo>
        <UIUserNameLabel>{task.assignedUser?.name}</UIUserNameLabel>
        <UIStatusLabel isDone={task.isDone}>
          {task.isDone && <UIMark>✓&nbsp;</UIMark>}
          {TASK_TYPE_LABELS.get(task.type || "") ?? task.type}
        </UIStatusLabel>
      </UITextInfo>
    </UISingleTask>
  );
});

const UISingleTask = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.horizontalActions.asGap};
`;

const UITextInfo = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const UIUserNameLabel = styled.span<{}>`
  ${theme.typo.content.semibold.resetLineHeight}
`;

const UIStatusLabel = styled.span<{ isDone: boolean }>`
  ${theme.typo.label.medium};
  color: ${(props) => (props.isDone ? theme.colors.primary : theme.colors.text.tertiary)};
  display: flex;
  align-items: center;
`;

const UIMark = styled.span`
  font-size: 1.5em;
`;
