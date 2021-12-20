import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { styledObserver } from "~shared/component";
import { niceFormatDateTime } from "~shared/dates/format";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/requests";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
  className?: string;
}

export const MessageTask = styledObserver(({ task, className }: Props) => {
  function getTooltip() {
    if (task.done_at) {
      return `Done ${niceFormatDateTime(new Date(task.done_at))}`;
    }

    if (task.seen_at) {
      return `Seen ${niceFormatDateTime(new Date(task.seen_at))}`;
    }

    return `Not seen yet`;
  }

  const isAbleToModifyTaskStatus = task.isAssignedToSelf && !task.topic?.isClosed;

  return (
    <UISingleTask
      data-test-task-assignee={task.user_id}
      key={task.id}
      data-tooltip={getTooltip()}
      className={className}
    >
      {task.assignedUser ? <UserAvatar size={30} user={task.assignedUser} /> : <Avatar name="?" />}
      <UITextInfo>
        <UIUserNameLabel>{task.assignedUser?.name}</UIUserNameLabel>

        <UIStatusLabel isDone={task.isDone} isActionable={isAbleToModifyTaskStatus}>
          {task.isDone && <UIMark>✓&nbsp;</UIMark>}
          {MENTION_TYPE_LABELS[task.type as RequestType] ?? task.type}
        </UIStatusLabel>
      </UITextInfo>
    </UISingleTask>
  );
})``;

const UISingleTask = styled.div<{}>`
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
  cursor: default;
  ${theme.box.selectOption};
`;

const UITextInfo = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const UIUserNameLabel = styled.span<{}>`
  ${theme.typo.content.semibold.resetLineHeight.nowrap};
`;

const UIStatusLabel = styled.span<{ isDone: boolean; isActionable: boolean }>`
  ${theme.typo.label.medium.nowrap};
  color: ${(props) => (props.isDone ? theme.colors.primary : undefined)};
  display: flex;
  align-items: center;
`;

const UIMark = styled.span`
  font-size: 1.5em;
`;
