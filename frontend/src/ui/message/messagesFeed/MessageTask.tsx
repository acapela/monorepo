import styled, { css } from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateTask } from "~frontend/gql/tasks";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { TaskBasicInfoFragment, UserBasicInfoFragment } from "~gql";
import { niceFormatDateTime } from "~shared/dates/format";
import { IconCheck, IconTime, IconUserCheck } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  task: TaskBasicInfoFragment;
  taskAssignee: UserBasicInfoFragment;
  className?: string;
}

export const MessageTask = styled(function MessageTask({ task, taskAssignee, className }: Props) {
  const currentUser = useCurrentUser();

  const isCurrentUserTask = currentUser?.id === taskAssignee.id;
  const isDone = !!task.done_at;
  const isTaskRead = !!task.seen_at;

  if (!taskAssignee) {
    return null;
  }

  function handleMarkAsRead() {
    updateTask({ taskId: task.id, input: { seen_at: new Date().toISOString() } });
  }

  function handleMarkAsUnread() {
    updateTask({ taskId: task.id, input: { seen_at: null } });
  }

  function getTaskStatus(): "unseen" | "seen" | "done" {
    if (task.done_at) return "done";
    if (task.seen_at) return "seen";

    return "unseen";
  }

  const taskStatus = getTaskStatus();

  return (
    <UISingleTask key={task.id} isDone={isDone} className={className}>
      {taskStatus === "unseen" && (
        <UIIconHolder data-tooltip={`Was not yet seen by ${taskAssignee.name}`}>
          <IconTime />
        </UIIconHolder>
      )}
      {taskStatus === "seen" && (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <UIIconHolder data-tooltip={`Seen by ${taskAssignee.name} at ${niceFormatDateTime(new Date(task.seen_at!))} `}>
          <IconUserCheck />
        </UIIconHolder>
      )}
      {taskStatus === "done" && (
        <UIIconHolder>
          <IconCheck />
        </UIIconHolder>
      )}
      Input from&nbsp;
      <UserAvatar user={taskAssignee} size={"extra-small"} />
      &nbsp;
      <UIUserNameLabel>{taskAssignee.name}`s</UIUserNameLabel>
      &nbsp;was requested.&nbsp;
      {isCurrentUserTask && (
        <>
          {isTaskRead && <UITextButton onClick={handleMarkAsUnread}>Mark as unread</UITextButton>}
          {!isTaskRead && <UITextButton onClick={handleMarkAsRead}>Mark as read</UITextButton>}
        </>
      )}
    </UISingleTask>
  );
})``;

const UISingleTask = styled.div<{ isDone: boolean }>`
  display: flex;
  align-items: center;
  color: ${theme.colors.layout.supportingText()};

  ${theme.font.body12.build()}

  strong {
    ${theme.font.semibold.build()};
  }

  ${(props) =>
    props.isDone &&
    css`
      text-decoration: line-through;
      opacity: 0.6;
    `}
`;

const UIUserNameLabel = styled.span<{}>`
  ${theme.font.semibold.build()}
`;

const UITextButton = styled.span<{}>`
  text-decoration: underline;
  cursor: pointer;
`;

const UIIconHolder = styled.span<{ horizontalFlip?: boolean }>`
  font-size: 1.5em;
  margin-right: 8px;

  ${(props) =>
    props.horizontalFlip &&
    css`
      transform: scaleX(-1);
    `}
`;
