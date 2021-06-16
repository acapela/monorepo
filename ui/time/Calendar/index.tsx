import React, { useState } from "react";
import { Header } from "./Header";
import { MonthDays } from "./MonthDays";
import styled from "styled-components";

interface Props {
  date: Date;
  onDateChange: (newDate: Date) => void;
}

export function Calendar({ date, onDateChange }: Props) {
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  return (
    <UICalendarContainer>
      <UICalendar>
        <Header currentMonthDate={currentMonthDate} onMonthChange={setCurrentMonthDate} />
        <SmallSpacing />
        <MonthDays
          key={currentMonthDate.getTime()}
          selectedDayDate={date}
          date={currentMonthDate}
          onDaySelected={onDateChange}
        />
      </UICalendar>
    </UICalendarContainer>
  );
}

const UICalendar = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1;
`;

const SmallSpacing = styled.div`
  margin-bottom: 10px;
`;

const UICalendarContainer = styled.div`
  flex: 1;
`;
