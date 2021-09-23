import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { Popover } from "~frontend/../../ui/popovers/Popover";
import { DateTimePicker } from "~frontend/../../ui/time/DateTimePicker";
import { updateTask } from "~frontend/gql/tasks";
import { MessageTask_TaskFragment } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";

interface Props {
  task: MessageTask_TaskFragment;
  children: ReactNode;
}

export const TaskDueDateSetter = ({ task, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isPickerOpen, { set: openPicker, unset: closePicker }] = useBoolean(false);

  const handleSubmit = async (date: Date) => {
    closePicker();
    updateTask({ taskId: task.id, input: { due_at: date.toISOString() } });
  };

  const calendarInitialValue = task.due_at ? new Date(task.due_at) : new Date();

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover enableScreenCover onClickOutside={closePicker} placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker
              shouldSkipConfirmation={false}
              onSubmit={handleSubmit}
              initialValue={calendarInitialValue}
            />
          </Popover>
        )}
      </AnimatePresence>
      <UITextButton ref={ref} onClick={openPicker}>
        {children}
      </UITextButton>
    </>
  );
};

const UITextButton = styled.span<{}>`
  white-space: nowrap;
  cursor: pointer;
  text-decoration: underline;
`;
