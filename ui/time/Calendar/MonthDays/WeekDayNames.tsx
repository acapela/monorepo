import React from "react";
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns";
import styled from "styled-components";

const now = new Date();
const firstDay = startOfWeek(now, { weekStartsOn: 1 });
const lastDay = endOfWeek(now, { weekStartsOn: 1 });

const days = eachDayOfInterval({ start: firstDay, end: lastDay });

export function WeekDaysNames() {
  return (
    <UIDays>
      {days.map((dayDate) => (
        <UILabel data-tooltip={format(dayDate, "EEEE")} key={dayDate.getTime()}>
          {format(dayDate, "EEEEEE")}
        </UILabel>
      ))}
    </UIDays>
  );
}

const UIDays = styled.div`
  display: flex;
  justify-content: space-around;
  flex: 1;
  align-items: center;
  margin-bottom: 4%;
`;

const UILabel = styled.div`
  font-weight: 450;
  opacity: 0.3;
  text-transform: uppercase;
  user-select: none;
`;
