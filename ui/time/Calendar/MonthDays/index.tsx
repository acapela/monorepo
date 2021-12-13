import { addWeeks, eachWeekOfInterval, endOfMonth, startOfMonth } from "date-fns";
import React from "react";
import styled, { css } from "styled-components";

import { Week } from "./Week";
import { WeekDaysNames } from "./WeekDayNames";

interface Props {
  date: Date;
  selectedDayDate: Date;
  onDaySelected: (dayDate: Date) => void;
}

/**
 * To avoid flickering of calendar height we'll always make it display max number of week rows a month can have - 6
 */
const MAX_WEEKS_IN_MONTH = 6;

export function MonthDays({ date, selectedDayDate, onDaySelected }: Props) {
  const firstDayMonth = startOfMonth(date);
  const lastDayMonth = endOfMonth(date);

  const weeks = eachWeekOfInterval(
    {
      start: firstDayMonth,
      end: lastDayMonth,
    },
    { weekStartsOn: 1 }
  );

  const missingWeeksForEqualHeight = MAX_WEEKS_IN_MONTH - weeks.length;

  return (
    <UIMonth>
      <WeekDaysNames />
      {weeks.map((firstDayWeek) => (
        <Week
          key={firstDayWeek.getTime()}
          weekDate={firstDayWeek}
          onDaySelected={onDaySelected}
          selectedDayDate={selectedDayDate}
          currentMonthDate={date}
        />
      ))}
      {missingWeeksForEqualHeight > 0 && (
        <UIHiddenWeeks>
          {Array.from({ length: missingWeeksForEqualHeight }).map((_, index) => {
            const date = addWeeks(firstDayMonth, weeks.length + index);
            return (
              <Week
                key={date.getTime()}
                weekDate={date}
                onDaySelected={onDaySelected}
                selectedDayDate={selectedDayDate}
                currentMonthDate={firstDayMonth}
              />
            );
          })}
        </UIHiddenWeeks>
      )}
    </UIMonth>
  );
}

/**
 * This is a bit of a magic.
 *
 * The goal here is to stretch the calendar a bit so days on left and right are 'touching' the sides of the calendar.
 *
 * ie. assume such week grid
 * |                CALENDAR                 |
 * |  1  |  2  |  3  |  4  |  5  |  6  |  7  |
 *
 * As can be seen, 1 and 7 are not 'touching' the side borders of the calendar.
 *
 * The goal is something more like:
 * |              CALENDAR               |
 * |1  |  2  |  3  |  4  |  5  |  6  |  7|
 *
 * It might look incorrect, but only if border is visible.
 *
 * To achieve such look, easy approach can be to use negative left/right margin.
 *
 * Now, how much of such margin:
 * For
 * |  1  |
 * to become
 * |1  |
 * we 'horizontal' padding from one side.
 *
 * We don't know this padding as content of the cell is just centered text.
 *
 * Therefore we need 'half of cell width reduced by half of text width'
 *
 * half of sell width is 100% / 7 / 2
 *
 * half of text size is 1ch (1 character width as in calendar we can have at most 2 chars - '31')
 *
 * Thus 100% / 7 / 2 - 1ch expressed as negative margin is calc(-100% / 7 / 2 + 1ch)
 */
const sideAlignOffset = css`
  margin-left: calc(-100% / 7 / 2 + 1ch);
  margin-right: calc(-100% / 7 / 2 + 1ch);
`;

const UIMonth = styled.div<{}>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 5;

  ${sideAlignOffset}
`;

const UIHiddenWeeks = styled.div`
  opacity: 0.2;
`;
