import { eachDayOfInterval, endOfWeek, isSameDay } from "date-fns";
import { startOfWeek } from "date-fns";
import React from "react";
import styled from "styled-components";
import { Day } from "./Day";

interface Props {
  weekDate: Date;
  onDaySelected: (dayDate: Date) => void;
  selectedDayDate: Date;
  currentMonthDate: Date;
}

export function Week({ weekDate, onDaySelected, selectedDayDate, currentMonthDate }: Props) {
  const lastDayWeek = endOfWeek(weekDate, { weekStartsOn: 1 });
  const firstDayWeek = startOfWeek(weekDate, { weekStartsOn: 1 });
  const weekdays = eachDayOfInterval({
    start: firstDayWeek,
    end: lastDayWeek,
  });

  return (
    <UIWeek>
      {weekdays.map((dayDate) => {
        const isThisDaySelected = isSameDay(dayDate, selectedDayDate);
        return (
          <Day
            currentMonthDate={currentMonthDate}
            key={dayDate.getTime()}
            dayDate={dayDate}
            isSelected={isThisDaySelected}
            onSelect={onDaySelected}
          />
        );
      })}
    </UIWeek>
  );
}

const UIWeek = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;
