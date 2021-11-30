import { formatRelative, isFriday } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { upperFirst } from "lodash";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { getNextWorkDayEndOfDay, getTodayEndOfDay } from "~shared/dates/times";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { IconClock } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { PopoverMenu, PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  dueDate: Date | null;
  onChange: (dueDate: Date | null) => void;
  isDisabled?: boolean;
}

export const TaskDueDateSetter = observer(({ dueDate, onChange, isDisabled }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const handleSubmit = async (dueDate: Date | null) => {
    closeCalendar();
    onChange(dueDate);
  };

  const calendarInitialValue = dueDate ?? getNextWorkDayEndOfDay();
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
            isDisabled={isDisabled}
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
              dueDate
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

      <UITriggerHolder ref={ref} onClick={openMenu} data-due-date-picker>
        <Button kind="secondary" size="compact" icon={<IconClock />} iconAtStart isDisabled={isDisabled}>
          {dueDate ? upperFirst(formatRelative(dueDate, new Date())) : "Add due date"}
        </Button>
      </UITriggerHolder>
    </>
  );
});

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;
