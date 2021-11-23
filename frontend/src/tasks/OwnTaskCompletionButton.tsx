import { observer } from "mobx-react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { getMentionColor } from "~frontend/message/extensions/mentions/TypedMention";
import { MentionType, REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";
import { Button, baseButtonStyles } from "~ui/buttons/Button";
import { IconUndo } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { theme } from "~ui/theme";

interface Props {
  task: TaskEntity;
}

function getUncompletedTaskLabel(task: TaskEntity) {
  const taskType = task.type;

  if (taskType === REQUEST_READ) {
    return "Mark as read";
  }
  if (taskType === REQUEST_ACTION) {
    return "Mark as done";
  }
  if (taskType === REQUEST_RESPONSE) {
    return "Mark as replied";
  }
}

function getCompletedTaskLabel(task: TaskEntity) {
  const taskType = task.type;

  if (taskType === REQUEST_READ) {
    return "Marked as read";
  }
  if (taskType === REQUEST_ACTION) {
    return "Marked as done";
  }
  if (taskType === REQUEST_RESPONSE) {
    return "Marked as replied";
  }
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
        {getUncompletedTaskLabel(task)}
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
      <Button key="done" kind="secondary" indicateDropdown>
        {getCompletedTaskLabel(task)}
      </Button>
    </PopoverMenuTrigger>
  );
});

const TaskColoredButton = styled.div<{ $taskType: MentionType }>`
  ${baseButtonStyles};
  ${theme.box.button};
  ${(props) => getMentionColor(props.$taskType).interactive};
`;
