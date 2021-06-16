import { addDays, eachDayOfInterval } from "date-fns";
import styled from "styled-components";
import { getDayBoundaries } from "~shared/dates/utils";
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

  const [dayStart, dayEnd] = getDayBoundaries(startDate);
  return (
    <UIHolder>
      {nextDays.map((nextDay, index) => {
        return <RoomsTimelineSingleDay displayEmpty={index === 0} key={nextDay.getTime()} startDate={nextDay} />;
      })}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${RoomsTimelineSingleDay} {
    margin-bottom: 64px;
  }
`;
