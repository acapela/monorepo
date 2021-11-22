import { observer } from "mobx-react";

import { REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE } from "~frontend/../../shared/types/mention";
import { Button } from "~frontend/../../ui/buttons/Button";
import { TaskEntity } from "~frontend/clientdb/task";
import { IconArrowLeft } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

interface Props {
  task: TaskEntity;
}

function getCompleteTaskLabel(task: TaskEntity) {
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

  function getLabel() {
    if (isDone) {
      return getCompletedTaskLabel(task);
    }

    return getCompleteTaskLabel(task);
  }

  if (!isDone) {
    return (
      <Button
        kind="primary"
        onClick={() => {
          task.update({ done_at: new Date().toISOString() });
        }}
      >
        {getCompleteTaskLabel(task)}
      </Button>
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
          icon: <IconArrowLeft />,
        },
      ]}
    >
      <Button key="done" kind="secondary" indicateDropdown>
        {getCompletedTaskLabel(task)}
      </Button>
    </PopoverMenuTrigger>
  );
});
