import { formatRelative, isFriday } from "date-fns";
import { AnimatePresence } from "framer-motion";
import { upperFirst } from "lodash";
import { observer } from "mobx-react";
import React, { useRef } from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "@aca/frontend/authentication/useCurrentUser";
import { useDb } from "@aca/frontend/clientdb";
import { useAssertCurrentTeam } from "@aca/frontend/team/CurrentTeam";
import { getNextWorkDayEndOfDay, getTodayEndOfDay } from "@aca/shared/dates/times";
import { convertUTCHourToZonedHour } from "@aca/shared/dates/utcUtils";
import { useBoolean } from "@aca/shared/hooks/useBoolean";
import { Button } from "@aca/ui/buttons/Button";
import { ButtonSize } from "@aca/ui/buttons/variants";
import { IconClock } from "@aca/ui/icons";
import { Popover } from "@aca/ui/popovers/Popover";
import { PopoverMenu, PopoverMenuOption } from "@aca/ui/popovers/PopoverMenu";
import { DateTimePicker } from "@aca/ui/time/DateTimePicker";

interface Props {
  dueDate: Date | null;
  onChange: (dueDate: Date | null) => void;
  size?: ButtonSize;
  isDisabled?: boolean;
}

export const TaskDueDateSetter = observer(({ dueDate, onChange, isDisabled, size = "compact" }: Props) => {
  const db = useDb();
  const userTokenData = useAssertCurrentUser();
  const teamInfo = useAssertCurrentTeam();
  const ref = useRef<HTMLDivElement>(null);

  const [isMenuOpen, { set: openMenu, unset: closeMenu }] = useBoolean(false);
  const [isCalendarOpen, { set: openCalendar, unset: closeCalendar }] = useBoolean(false);

  const getCurrentUserEndOfDay = (): number | undefined => {
    const currentTeamMember = db.teamMember.query({
      user_id: userTokenData.id,
      team_id: teamInfo.id,
    }).first;
    const currentUserTimezone = currentTeamMember?.timezone;
    const endOfWorkInUTC = currentTeamMember?.work_end_hour_in_utc;
    if (currentUserTimezone && endOfWorkInUTC) {
      return convertUTCHourToZonedHour(endOfWorkInUTC, currentUserTimezone);
    }
  };

  const handleSubmit = async (dueDate: Date | null) => {
    closeCalendar();
    onChange(dueDate);
  };

  const calendarInitialValue = dueDate ?? getNextWorkDayEndOfDay(getCurrentUserEndOfDay());
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
                  onSelect: () => handleSubmit(getTodayEndOfDay(getCurrentUserEndOfDay())),
                },
                {
                  key: "tomorrow",
                  label: isLastDayOfWorkWeek ? "Next monday, End of day" : "Tomorrow, End of day",
                  onSelect: () => handleSubmit(getNextWorkDayEndOfDay(getCurrentUserEndOfDay())),
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
        <Button kind="secondary" size={size} icon={<IconClock />} iconAtStart isDisabled={isDisabled}>
          {dueDate ? upperFirst(formatRelative(dueDate, new Date())) : "Add due date"}
        </Button>
      </UITriggerHolder>
    </>
  );
});

const UITriggerHolder = styled.div<{}>`
  display: inline-block;
`;
