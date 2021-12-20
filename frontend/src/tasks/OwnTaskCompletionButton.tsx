import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TaskEntity } from "~frontend/clientdb/task";
import { getMentionColor } from "~frontend/message/extensions/mentions/TypedMention";
import {
  COMPLETED_REQUEST_LABEL,
  MentionType,
  REQUEST_DECISION,
  RequestType,
  UNCOMPLETED_REQUEST_LABEL,
} from "~shared/requests";
import { Button, baseButtonStyles } from "~ui/buttons/Button";
import { IconCheckboxCircle, IconUndo } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

export const OwnTaskCompletionButton = observer(function OwnTaskCompletionButton({ task }: Props) {
  const currentUser = useAssertCurrentUser();
  if (task.type === REQUEST_DECISION && !task.isDone) {
    return null;
  }

  if (!task.isDone) {
    return (
      <TaskColoredButton
        $taskType={task.type as MentionType}
        onClick={() => {
          task.update({ done_at: new Date().toISOString() });
        }}
      >
        {UNCOMPLETED_REQUEST_LABEL[task.type as RequestType]}
      </TaskColoredButton>
    );
  }

  return (
    <PopoverMenuTrigger
      options={[
        {
          key: "undo",
          label: "Undo",
          onSelect: () => {
            task.update({ done_at: null });
            task.message?.decisionOptions.all
              .flatMap((option) => option.votes.all)
              .find((vote) => vote.user_id == currentUser.id)
              ?.remove();
          },
          icon: <IconUndo />,
        },
      ]}
    >
      <Button key="done" kind="secondary" size="compact" icon={<IconCheckboxCircle />} indicateDropdown>
        {COMPLETED_REQUEST_LABEL[task.type as RequestType]}
      </Button>
    </PopoverMenuTrigger>
  );
});

const TaskColoredButton = styled.div<{ $taskType: MentionType }>`
  ${baseButtonStyles};
  ${theme.box.compactButton};
  ${(props) => getMentionColor(props.$taskType).interactive};
`;
