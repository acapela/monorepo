import { observer } from "mobx-react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { getMentionColor } from "~frontend/message/extensions/mentions/TypedMention";
import { MentionType, RequestType, getCompletedTaskLabel, getUncompletedTaskLabel } from "~shared/types/mention";
import { Button, baseButtonStyles } from "~ui/buttons/Button";
import { IconUndo } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

export const OwnTaskCompletionButton = observer(function OwnTaskCompletionButton({ task }: Props) {
  const isDone = task.isDone;

  if (!isDone) {
    return (
      <TaskColoredButton
        $taskType={task.type as MentionType}
        onClick={() => {
          task.update({ done_at: new Date().toISOString() });
        }}
      >
        {getUncompletedTaskLabel(task.type as RequestType)}
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
          },
          icon: <IconUndo />,
        },
      ]}
    >
      <Button key="done" kind="secondary" size="compact" indicateDropdown>
        {getCompletedTaskLabel(task.type as RequestType)}
      </Button>
    </PopoverMenuTrigger>
  );
});

const TaskColoredButton = styled.div<{ $taskType: MentionType }>`
  ${baseButtonStyles};
  ${theme.box.compactButton};
  ${(props) => getMentionColor(props.$taskType).interactive};
`;
