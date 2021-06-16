import { startOfToday } from "date-fns";
import { useState } from "react";
import styled from "styled-components";
import { Calendar } from "~ui/time/Calendar";
import { RoomsTimeline } from "./RoomsTimeline";

export function CalendarView() {
  const [selectedDay, setSelectedDay] = useState(startOfToday);
  return (
    <UIHolder>
      <Calendar date={selectedDay} onDateChange={setSelectedDay} />
      <RoomsTimeline startDate={selectedDay} />
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 280px) 1fr;
  grid-gap: 64px;
`;
