import { isFriday, nextMonday, setHours, startOfToday, startOfTomorrow } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { MessageEntity } from "~frontend/clientdb/message";
import { assert } from "~shared/assert";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Popover } from "~ui/popovers/Popover";
import { PopoverMenu, PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  message: MessageEntity;
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

export const TaskDueDateSetter = observer(({ message, children }: Props) => {
  assert(message.tasks.hasItems, "Attempting to set due date for message that doesn't have tasks");

  const ref = useRef<HTMLDivElement>(null);

  const currentDueDate = message.tasks.first?.due_at;

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const handleSubmit = async (date: Date | null) => {
    closeCalendar();
    message.tasks.all.forEach((task) => task.update({ due_at: date?.toISOString() ?? null }));
  };

  const calendarInitialValue = currentDueDate ? new Date(currentDueDate) : getNextWorkDayEndOfDay();
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
              currentDueDate
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
});

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;
