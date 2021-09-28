import { gql } from "@apollo/client";
import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";

import { createMutation } from "~frontend/gql/utils";
import { UpdateTasksInMessageMutation, UpdateTasksInMessageMutationVariables } from "~gql";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  messageId: string;
  previousDueDate?: string | null;
  children: ReactNode;
}

const END_OF_WORK_DAY = 17;

function getTodayEndOfDay() {
  return setHours(startOfToday(), END_OF_WORK_DAY);
}

function getTomorrowEndOfDay() {
  const now = new Date();
  const nextWorkDay = isFriday(now) ? nextMonday(now) : startOfTomorrow();

  return setHours(nextWorkDay, END_OF_WORK_DAY);
}

export const [, { mutate: updateTasksInMessage }] = createMutation<
  UpdateTasksInMessageMutation,
  UpdateTasksInMessageMutationVariables
>(
  () => gql`
    mutation UpdateTasksInMessage($messageId: uuid!, $input: task_set_input!) {
      update_task(where: { message_id: { _eq: $messageId } }, _set: $input) {
        returning {
          id
        }
      }
    }
  `
);

export const TaskDueDateSetter = ({ messageId, previousDueDate, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const handleSubmit = async (date: Date) => {
    closeCalendar();
    updateTasksInMessage({ messageId, input: { due_at: date.toISOString() } });
  };

  const calendarInitialValue = previousDueDate ? new Date(previousDueDate) : getTomorrowEndOfDay();

  return (
    <>
      <AnimatePresence>
        {isCalendarOpen && (
          <Popover enableScreenCover onClickOutside={closeCalendar} anchorRef={ref}>
            <DateTimePicker
              shouldSkipConfirmation={false}
              onSubmit={handleSubmit}
              initialValue={calendarInitialValue}
            />
          </Popover>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <PopoverMenu
            onCloseRequest={() => {
              closeMenu();
            }}
            anchorRef={ref}
            options={[
              {
                key: "today",
                label: "Today, End of Day",
                onSelect: () => handleSubmit(getTodayEndOfDay()),
              },
              {
                key: "tomorrow",
                label: "Tomorrow, End of Day",
                onSelect: () => handleSubmit(getTomorrowEndOfDay()),
              },
              {
                key: "other",
                label: "Other...",
                onSelect: () => {
                  closeMenu();
                  openCalendar();
                },
              },
            ]}
          />
        )}
      </AnimatePresence>

      <div ref={ref} onClick={openMenu}>
        {children}
      </div>
    </>
  );
};
