import { gql } from "@apollo/client";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
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
  taskOwnerId: string;
  taskAssignee: UserBasicInfoFragment;
  className?: string;
}

const fragments = {
  task: gql`
    fragment MessageTask_task on task {
      id
      user_id
      message_id
      seen_at
      done_at
      due_at
      type
    }
  `,
};

const _MessageTask = styled(function MessageTask({ task, taskOwnerId, taskAssignee, className }: Props) {
  const currentUser = useCurrentUser();

  const isCurrentUserTask = currentUser?.id === taskAssignee.id;
  const isTaskOwner = currentUser?.id === taskOwnerId;
  const isDone = !!task.done_at;
  const isTaskRead = !!task.seen_at;

  if (!taskAssignee) {
    return null;
  }

  function handleMarkAsRead() {
    const now = new Date();
    const nowAsIsoString = now.toISOString();

    const isTaskToBeMarkedAsDone = task.type === "request-read";
    const doneParams = isTaskToBeMarkedAsDone ? { done_at: nowAsIsoString } : {};

    updateTask({ taskId: task.id, input: { seen_at: nowAsIsoString, ...doneParams } });

    trackEvent("Marked Task As Seen", {
      taskId: task.id,
      taskType: task.type as string,
      messageId: task.message_id,
      seenAt: now,
    });

    if (isTaskToBeMarkedAsDone) {
      trackEvent("Completed Task", {
        taskId: task.id,
        taskType: task.type as string,
        messageId: task.message_id,
        doneAt: now,
      });
    }
  }

  function handleMarkAsUnread() {
    const isTaskToBeMarkedAsIncomplete = task.type === "request-read";
    const doneParams = isTaskToBeMarkedAsIncomplete ? { done_at: null } : {};

    updateTask({ taskId: task.id, input: { seen_at: null, ...doneParams } });

    trackEvent("Marked Task As Unseen", {
      taskId: task.id,
      taskType: task.type as string,
      messageId: task.message_id,
    });
  }

  function getTaskRequestLabel(): string {
    if (task.type === "request-read") return "Read receipt";
    // Null tasks are handled as "Request read" until all has been migrated to new types
    return "Response";
  }

  const taskRequestLabel = getTaskRequestLabel();

  return (
    <UISingleTask
      key={task.id}
      isDone={isDone}
      data-test-task-is-done={isDone ? true : undefined}
      className={className}
    >
      <TaskStatusIcon task={task} taskAssigneeName={taskAssignee.name ?? ""} />
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
      {isTaskOwner && task.due_at === null && (
        <UITextButton onClick={() => console.log("clicked")}>Add due date</UITextButton>
      )}
    </UISingleTask>
  );
})``;

export const MessageTask = withFragments(fragments, _MessageTask);

const TaskStatusIcon = ({ task, taskAssigneeName }: { task: MessageTask_TaskFragment; taskAssigneeName: string }) => {
  function getTaskStatus(): "unseen" | "seen" | "done" {
    if (task.done_at) return "done";
    if (task.seen_at) return "seen";

    return "unseen";
  }

  const taskStatus = getTaskStatus();
  return (
    <>
      {taskStatus === "unseen" && (
        <UIIconHolder data-tooltip={`Was not yet seen by ${taskAssigneeName}`}>
          <IconTime />
        </UIIconHolder>
      )}
      {taskStatus === "seen" && (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        <UIIconHolder data-tooltip={`Seen by ${taskAssigneeName} at ${niceFormatDateTime(new Date(task.seen_at!))} `}>
          <IconUserCheck />
        </UIIconHolder>
      )}
      {taskStatus === "done" && (
        <UIIconHolder>
          <IconCheck />
        </UIIconHolder>
      )}
    </>
  );
};

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
