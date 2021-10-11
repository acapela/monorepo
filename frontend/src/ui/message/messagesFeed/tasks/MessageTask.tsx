import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { Avatar } from "~frontend/ui/users/Avatar";
import { UserAvatar } from "~frontend/ui/users/UserAvatar";
import { getTeamInvitationDisplayName } from "~frontend/utils/getTeamInvitationDisplayName";
import { assert } from "~shared/assert";
import { MentionType } from "~shared/types/mention";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

const taskTypeToLabel = (type: MentionType, isDone: boolean) => {
  switch (type) {
    case "request-read":
      return isDone ? "Confirmed" : "Confirmation";

    case "request-response":
      return isDone ? "Feedbacked" : "Feedback";
  }
};

export const MessageTask = observer(({ task }: Props) => {
  const teamInvitation = task.teamInvitation;
  assert(task.user || teamInvitation, "task has neither user nor invitation");
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const assigneeName = task.user?.name ?? getTeamInvitationDisplayName(teamInvitation!);

  const isDone = !!task.done_at;
  return (
    <UISingleTask key={task.id}>
      {task.user ? <UserAvatar user={task.user} /> : <Avatar name="?" />}
      <UITextInfo>
        <UIUserNameLabel>{assigneeName}</UIUserNameLabel>
        <UIStatusLabel isDone={isDone}>
          {isDone && "✓ "}
          {taskTypeToLabel(task.type as MentionType, isDone)}
        </UIStatusLabel>
      </UITextInfo>
    </UISingleTask>
  );
});

const UISingleTask = styled.div<{}>`
  display: flex;
  gap: 10px;
`;

const UITextInfo = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const UIUserNameLabel = styled.span<{}>`
  ${theme.font.semibold.build()}
`;

const UIStatusLabel = styled.span<{ isDone: boolean }>`
  ${theme.font.withExceptionalSize("11px", "small").withExceptionalLineHeight("1.2", "new design").build()}
  color: ${(props) => (props.isDone ? "#ff57e3" : "rgba(0, 0, 0, 0.4)")};
`;
