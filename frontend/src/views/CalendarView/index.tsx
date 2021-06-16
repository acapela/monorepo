import { startOfToday } from "date-fns";
import { useState } from "react";
import styled from "styled-components";
import { Calendar } from "~ui/time/Calendar";

export function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(startOfToday);
  return (
    <UIHolder>
      <Calendar date={selectedDay} onDateChange={setSelectedDay} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 320px) 1fr;
`;
