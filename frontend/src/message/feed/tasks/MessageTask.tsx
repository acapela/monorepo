import { observer } from "mobx-react";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { niceFormatDateTime } from "~shared/dates/format";
import { MENTION_TYPE_LABELS, RequestType } from "~shared/types/mention";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

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

  const taskEditOptions: PopoverMenuOption[] = useMemo(() => {
    if (task.isDone) {
      return [
        {
          key: "unfinished",
          label: "Mark as Incomplete",
          onSelect: () => task.update({ done_at: null }),
        },
      ];
    } else {
      return [
        {
          key: "complete",
          label: "Mark as Complete",
          onSelect: () => {
            task.update({ done_at: new Date().toISOString() });
          },
        },
      ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, task.isDone]);

  const isAbleToModifyTaskStatus = task.isAssignedToSelf && !task.topic?.isClosed;

  return (
    <UISingleTask data-test-task-assignee={task.user_id} key={task.id} data-tooltip={getTooltip()}>
      {task.assignedUser ? <UserAvatar size={30} user={task.assignedUser} /> : <Avatar name="?" />}
      <UITextInfo>
        <UIUserNameLabel>{task.assignedUser?.name}</UIUserNameLabel>
        <PopoverMenuTrigger isDisabled={!isAbleToModifyTaskStatus} options={taskEditOptions} placement="bottom">
          <UIStatusLabel isDone={task.isDone} isActionable={isAbleToModifyTaskStatus}>
            {task.isDone && <UIMark>✓&nbsp;</UIMark>}
            {MENTION_TYPE_LABELS[task.type as RequestType] ?? task.type}
            {!task.isDone && isAbleToModifyTaskStatus && <UIChevronDown />}
          </UIStatusLabel>
        </PopoverMenuTrigger>
      </UITextInfo>
    </UISingleTask>
  );
});

const UISingleTask = styled.div<{}>`
  overflow-y: hidden;
  display: flex;
  align-items: center;
  ${theme.spacing.actions.asGap};
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
  color: ${(props) => (props.isDone ? theme.colors.primary : theme.colors.text.tertiary)};
  display: flex;
  align-items: center;

  ${(props) =>
    props.isActionable &&
    css`
      cursor: pointer;
    `}
`;

const UIMark = styled.span`
  font-size: 1.5em;
`;

const UIChevronDown = styled(IconChevronDown)<{}>`
  /* Tweak positioning to be inline with font  */
  margin-bottom: -2px;
  height: 1.1rem;
  width: 1.1rem;
`;
