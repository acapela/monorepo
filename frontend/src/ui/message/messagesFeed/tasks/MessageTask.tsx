import { gql } from "@apollo/client";
import React from "react";
import styled, { css } from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { updateTask } from "~frontend/gql/tasks";
import { withFragments } from "~frontend/gql/utils";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getTeamInvitationDisplayName } from "~frontend/utils/getTeamInvitationDisplayName";
import { MessageTask_TaskFragment } from "~gql";
import { assert } from "~shared/assert";
import { relativeFormatDateTime } from "~shared/dates/format";
import { theme } from "~ui/theme";

import { TaskStatusIcon } from "./TaskStatusIcon";

interface Props {
  task: MessageTask_TaskFragment;
  className?: string;
}

const fragments = {
  task: gql`
    ${UserAvatar.fragments.user}

    fragment MessageTask_task on task {
      id
      user {
        id
        name
        ...UserAvatar_user
      }
      team_invitation {
        slack_user_id
      }
      message_id
      seen_at
      done_at
      due_at
      type
    }
  `,
};

const _MessageTask = styled(function MessageTask({ task, className }: Props) {
  const currentUser = useCurrentUser();

  const isCurrentUserTask = currentUser?.id === task.user?.id;
  const isDone = !!task.done_at;
  const isTaskRead = !!task.seen_at;

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

  const teamInvitation = task.team_invitation;
  assert(task.user || teamInvitation, "task has neither user nor invitation");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const assigneeName = task.user?.name ?? getTeamInvitationDisplayName(teamInvitation!);

  return (
    <UISingleTask
      key={task.id}
      isDone={isDone}
      data-test-task-is-done={isDone ? true : undefined}
      className={className}
    >
      <TaskStatusIcon task={task} taskAssigneeName={assigneeName} />
      {taskRequestLabel} from&nbsp;
      {task.user && (
        <>
          <UserAvatar user={task.user} size="extra-small" />
          &nbsp;
        </>
      )}
      <UIUserNameLabel>{assigneeName}</UIUserNameLabel>
      &nbsp;was requested
      {task.due_at !== null && <>&nbsp;by&nbsp;{relativeFormatDateTime(new Date(task.due_at as string))}</>}
      .&nbsp;
      {isCurrentUserTask && (
        <>
          {isTaskRead && <UITextButton onClick={handleMarkAsUnread}>Mark as unread</UITextButton>}
          {!isTaskRead && <UITextButton onClick={handleMarkAsRead}>Mark as read</UITextButton>}
          &nbsp;
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
