import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { niceFormatDateTime } from "~shared/dates/format";
import { IconCheck, IconTime, IconUserCheck } from "~ui/icons";

interface Props {
  task: TaskEntity;
  taskAssigneeName: string;
}

export const TaskStatusIcon = observer(({ task, taskAssigneeName }: Props) => {
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
});

const UIIconHolder = styled.span<{}>`
  font-size: 1.5em;
  margin-right: 8px;
`;
