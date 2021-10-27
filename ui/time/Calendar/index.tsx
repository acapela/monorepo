import React, { useState } from "react";
import styled from "styled-components";

import { Header } from "./Header";
import { MonthDays } from "./MonthDays";

interface Props {
  date: Date;
  onDateChange: (newDate: Date) => void;
}

export function Calendar({ date, onDateChange }: Props) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());

  function handleDateChange(newDate: Date) {
    onDateChange(newDate);
  }

  return (
    <UICalendarContainer>
      <UICalendar>
        <Header currentMonthDate={currentMonthDate} onMonthChange={setCurrentMonthDate} />
        <SmallSpacing />
        <MonthDays
          key={currentMonthDate.getTime()}
          selectedDayDate={date}
          date={currentMonthDate}
          onDaySelected={handleDateChange}
        />
      </UICalendar>
    </UICalendarContainer>
  );
}

const UICalendar = styled.div<{}>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
`;

const SmallSpacing = styled.div<{}>`
  margin-bottom: 10px;
`;

const UICalendarContainer = styled.div<{}>`
  flex: 1;
`;
