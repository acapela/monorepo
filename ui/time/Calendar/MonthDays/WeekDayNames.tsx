import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import React from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

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

const UIDays = styled.div<{}>`
  display: flex;
  justify-content: space-around;
  flex: 1;
  align-items: center;
  margin-bottom: 4%;
`;

const UILabel = styled.div<{}>`
  ${theme.typo.functional.hint.size(10).semibold.upper};
  user-select: none;
  opacity: 0.2;
`;
