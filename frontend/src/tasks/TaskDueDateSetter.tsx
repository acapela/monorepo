import { formatRelative, isFriday } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { upperFirst } from "lodash";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { MessageEntity } from "~frontend/clientdb/message";
import { assert } from "~shared/assert";
import { getNextWorkDayEndOfDay, getTodayEndOfDay } from "~shared/dates/times";
import { useBoolean } from "~shared/hooks/useBoolean";
import { Button } from "~ui/buttons/Button";
import { IconClock } from "~ui/icons";
import { Popover } from "~ui/popovers/Popover";
import { PopoverMenu, PopoverMenuOption } from "~ui/popovers/PopoverMenu";
import { DateTimePicker } from "~ui/time/DateTimePicker";

interface Props {
  message: MessageEntity;
}

export const TaskDueDateSetter = observer(({ message }: Props) => {
  assert(message.tasks.hasItems, "Attempting to set due date for message that doesn't have tasks");

  const ref = useRef<HTMLDivElement>(null);
  const db = useDb();

  const currentDueDate = message.dueDate;

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const handleSubmit = async (dueDate: Date | null) => {
    closeCalendar();

    const previouslyStoredDueDate = db.messageTaskDueDate.query({ message_id: message.id }).first;

    if (!dueDate && previouslyStoredDueDate) {
      previouslyStoredDueDate.remove();
    } else if (dueDate && previouslyStoredDueDate) {
      previouslyStoredDueDate.update({
        due_at: dueDate.toISOString(),
      });
    } else if (dueDate && !previouslyStoredDueDate) {
      db.messageTaskDueDate.create({
        message_id: message.id,
        due_at: dueDate.toISOString(),
      });
    }
  };

  const calendarInitialValue = currentDueDate ?? getNextWorkDayEndOfDay();
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
            isDisabled={message.topic?.isClosed ?? false}
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

      <UITriggerHolder ref={ref} onClick={openMenu} data-due-date-picker>
        <Button kind="secondary" size="compact" icon={<IconClock />} iconAtStart isDisabled={message.topic?.isClosed}>
          {currentDueDate ? upperFirst(formatRelative(currentDueDate, new Date())) : "Add due date"}
        </Button>
      </UITriggerHolder>
    </>
  );
});

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;
