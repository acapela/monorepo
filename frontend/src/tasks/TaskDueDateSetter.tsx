import { isFriday, nextMonday, setHours, startOfTomorrow } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { updateTask } from "~frontend/gql/tasks";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  taskId: string;
  previousDueDate?: string | null;
  children: ReactNode;
}

const DEFAULT_MIDDLE_OF_WORK_DAY = 14;

function getDefaultInitialDueDate() {
  const now = new Date();
  const nextWorkDay = isFriday(now) ? nextMonday(now) : startOfTomorrow();

  return setHours(nextWorkDay, DEFAULT_MIDDLE_OF_WORK_DAY);
}

export const TaskDueDateSetter = ({ taskId, previousDueDate, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isPickerOpen, { set: openPicker, unset: closePicker }] = useBoolean(false);

  const handleSubmit = async (date: Date) => {
    closePicker();
    updateTask({ taskId: taskId, input: { due_at: date.toISOString() } });
  };

  const calendarInitialValue = previousDueDate ? new Date(previousDueDate) : getDefaultInitialDueDate();

  return (
    <>
      <AnimatePresence>
        {isPickerOpen && (
          <Popover enableScreenCover onClickOutside={closePicker} placement={"bottom-start"} anchorRef={ref}>
            <DateTimePicker shouldSkipConfirmation={true} onSubmit={handleSubmit} initialValue={calendarInitialValue} />
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
