import { addDays, eachDayOfInterval, isSameDay } from "date-fns";
import { AnimateSharedLayout } from "framer-motion";
import styled from "styled-components";

import { RoomsTimelineSingleDay } from "./RoomsTimelineSingleDay";

interface Props {
  startDate: Date;
}

function getNextNDaysList(startDate: Date, count: number) {
  const endDate = addDays(startDate, count);
  return eachDayOfInterval({ start: startDate, end: endDate });
}

export function RoomsTimeline({ startDate }: Props) {
  const nextDays = getNextNDaysList(startDate, 14);

  return (
    <UIHolder>
      <AnimateSharedLayout>
        {nextDays.map((nextDay) => {
          return (
            <RoomsTimelineSingleDay
              // Show day even if it's empty for the first day (day selected in the calendar)
              displayEmpty={isSameDay(nextDay, startDate)}
              key={nextDay.getTime()}
              startDate={nextDay}
            />
          );
        })}
      </AnimateSharedLayout>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  ${RoomsTimelineSingleDay} {
    margin-bottom: 64px;
  }
`;
