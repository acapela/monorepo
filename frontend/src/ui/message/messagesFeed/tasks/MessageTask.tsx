import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
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

export const MessageTask = observer(({ task }: Props) => (
  <UISingleTask key={task.id}>
    {task.assignedUser ? <UserAvatar size={30} user={task.assignedUser} /> : <Avatar name="?" />}
    <UITextInfo>
      <UIUserNameLabel>{task.assignedUser?.name}</UIUserNameLabel>
      <UIStatusLabel isDone={task.isDone}>
        {task.isDone && "✓ "}
        {TASK_TYPE_LABELS.get(task.type || "") ?? task.type}
      </UIStatusLabel>
    </UITextInfo>
  </UISingleTask>
));

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
  ${theme.typo.label};
  color: ${(props) => (props.isDone ? "#ff57e3" : "hsla(0, 0%, 0%, 0.4)")};
`;
