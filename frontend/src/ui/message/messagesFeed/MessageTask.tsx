import { gql } from "@apollo/client";
import styled, { css } from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateTask } from "~frontend/gql/tasks";
import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { MessageTask_TaskFragment, UserBasicInfoFragment } from "~gql";
import { niceFormatDateTime } from "~shared/dates/format";
import { IconCheck, IconTime, IconUserCheck } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  task: MessageTask_TaskFragment;
  taskAssignee: UserBasicInfoFragment;
  className?: string;
}

const fragments = {
  task: gql`
    fragment MessageTask_task on task {
      id
      seen_at
      done_at
      user_id
      type
    }
  `,
};

const _MessageTask = styled(function MessageTask({ task, taskAssignee, className }: Props) {
  const currentUser = useCurrentUser();

  const isCurrentUserTask = currentUser?.id === taskAssignee.id;
  const isDone = !!task.done_at;
  const isTaskRead = !!task.seen_at;

  if (!taskAssignee) {
    return null;
  }

  function handleMarkAsRead() {
    const nowAsIsoString = new Date().toISOString();
    const done_at = task.type === "request-read" ? nowAsIsoString : task.done_at;
    updateTask({ taskId: task.id, input: { seen_at: nowAsIsoString, done_at } });
  }

  function handleMarkAsUnread() {
    const done_at = task.type === "request-read" ? null : task.done_at;
    updateTask({ taskId: task.id, input: { seen_at: null, done_at } });
  }

  function getTaskStatus(): "unseen" | "seen" | "done" {
    if (task.done_at) return "done";
    if (task.seen_at) return "seen";

    return "unseen";
  }

  function getTaskRequestLabel(): string {
    if (task.type === "request-read") return "Read receipt";
    // Null tasks are handled as "Request read" until all has been migrated to new types
    return "Response";
  }

  const taskStatus = getTaskStatus();
  const taskRequestLabel = getTaskRequestLabel();

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
      {taskRequestLabel} from&nbsp;
      <UserAvatar user={taskAssignee} size={"extra-small"} />
      &nbsp;
      <UIUserNameLabel>{taskAssignee.name}</UIUserNameLabel>
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

export const MessageTask = withFragments(fragments, _MessageTask);

const UISingleTask = styled.div<{ isDone: boolean }>`
  display: flex;
  flex-grow: 1;
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
  white-space: nowrap;
  cursor: pointer;
  text-decoration: underline;
`;

const UIIconHolder = styled.span<{}>`
  font-size: 1.5em;
  margin-right: 8px;
`;
