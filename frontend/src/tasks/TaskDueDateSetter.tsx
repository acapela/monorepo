import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";
import { AnimatePresence } from "framer-motion";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { PopoverMenu, PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  task: TaskEntity;
  children: ReactNode;
}

const END_OF_WORK_DAY = 17;

function getTodayEndOfDay() {
  return setHours(startOfToday(), END_OF_WORK_DAY);
}

function getNextWorkDayEndOfDay() {
  const today = startOfToday();
  const nextWorkDay = isFriday(today) ? nextMonday(today) : startOfTomorrow();

  return setHours(nextWorkDay, END_OF_WORK_DAY);
}

export const TaskDueDateSetter = ({ task, children }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const handleSubmit = async (date: Date | null) => {
    closeCalendar();
    task.update({ due_at: date?.toISOString() ?? null });
  };

  const calendarInitialValue = task.due_at ? new Date(task.due_at) : getNextWorkDayEndOfDay();
  const isLastDayOfWorkWeek = isFriday(new Date());

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
            options={(
              [
                {
                  key: "today",
                  label: "Today, End of day",
                  onSelect: () => handleSubmit(getTodayEndOfDay()),
                },
                {
                  key: "tomorrow",
                  label: isLastDayOfWorkWeek ? "Next monday, End of day" : "Tomorrow, End of day",
                  onSelect: () => handleSubmit(getNextWorkDayEndOfDay()),
                },
                {
                  key: "other",
                  label: "Other...",
                  onSelect: () => {
                    closeMenu();
                    openCalendar();
                  },
                },
              ] as PopoverMenuOption[]
            ).concat(
              // Add option to delete due date if previously present
              task.due_at
                ? [
                    {
                      key: "delete",
                      label: "Remove due date",
                      onSelect: () => handleSubmit(null),
                      isDestructive: true,
                    },
                  ]
                : []
            )}
          />
        )}
      </AnimatePresence>

      <UITriggerHolder ref={ref} onClick={openMenu}>
        {children}
      </UITriggerHolder>
    </>
  );
};

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;
