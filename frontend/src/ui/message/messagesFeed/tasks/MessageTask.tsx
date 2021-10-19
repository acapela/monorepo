import { observer } from "mobx-react";
import React, { useMemo } from "react";
import styled, { css } from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { niceFormatDateTime } from "~shared/dates/format";
import { IconChevronDown } from "~ui/icons";
import { PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
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
          onSelect: () => task.update({ done_at: new Date().toISOString() }),
        },
      ];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, task.isDone]);

  return (
    <UISingleTask key={task.id} data-tooltip={getTooltip()}>
      {task.assignedUser ? <UserAvatar size={30} user={task.assignedUser} /> : <Avatar name="?" />}
      <UITextInfo>
        <UIUserNameLabel>{task.assignedUser?.name}</UIUserNameLabel>
        <PopoverMenuTrigger isDisabled={!task.isAssignedToSelf} options={taskEditOptions} placement="bottom">
          <UIStatusLabel isDone={task.isDone} isActionable={task.isAssignedToSelf}>
            {task.isDone && <UIMark>✓&nbsp;</UIMark>}
            {TASK_TYPE_LABELS.get(task.type || "") ?? task.type}
            {!task.isDone && task.isAssignedToSelf && <UIChevronDown />}
          </UIStatusLabel>
        </PopoverMenuTrigger>
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

const UIStatusLabel = styled.span<{ isDone: boolean; isActionable: boolean }>`
  ${theme.typo.label.medium};
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
  margin-bottom: -3px;
  height: 1.1rem;
  width: 1.1rem;
`;
