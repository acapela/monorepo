import { observer } from "mobx-react";
import styled from "styled-components";

import { useAssertCurrentUser } from "@aca/frontend/authentication/useCurrentUser";
import { TaskEntity } from "@aca/frontend/clientdb/task";
import { getMentionColor } from "@aca/frontend/message/extensions/mentions/TypedMention";
import {
  COMPLETED_REQUEST_LABEL,
  MentionType,
  REQUEST_DECISION,
  RequestType,
  UNCOMPLETED_REQUEST_LABEL,
} from "@aca/shared/requests";
import { Button, baseButtonStyles } from "@aca/ui/buttons/Button";
import { IconCheckboxCircle, IconUndo } from "@aca/ui/icons";
import { PopoverMenuTrigger } from "@aca/ui/popovers/PopoverMenuTrigger";
import { theme } from "@aca/ui/theme";

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
  ${theme.box.control.compact};
  ${(props) => getMentionColor(props.$taskType).interactive};
`;
