import styled from "styled-components";
import { ItemTitle } from "~ui/typo";
import { endOfDay, startOfDay } from "date-fns";
import { getDayBoundaries } from "~shared/dates/utils";
import { niceFormatDate } from "~shared/dates/format";
import { RoomsList } from "~frontend/ui/rooms/RoomsList";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconCalendar } from "~ui/icons";
import { motion } from "framer-motion";
import { getSpringTransitionWithDuration } from "~ui/animations";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { GoogleCalendarEventsInDay } from "./GoogleCalendarEventsInDay";
import { googleCalendarEventsApi } from "~frontend/requests/googleCalendar";

interface Props {
  startDate: Date;
  className?: string;
  displayEmpty?: boolean;
}

export const RoomsTimelineSingleDay = styled(function RoomsTimelineSingleDay({
  startDate,
  className,
  displayEmpty,
}: Props) {
  const [dayStart, dayEnd] = getDayBoundaries(startDate);
  const [rooms = []] = useRoomsQuery({
    where: {
      deadline: {
        _gte: dayStart.toISOString(),
        _lte: dayEnd.toISOString(),
      },
    },
  });
  const [googleCalendarEvents = []] = googleCalendarEventsApi.use({
    eventsStartDate: startOfDay(startDate),
    eventsEndDate: endOfDay(startDate),
  });

  const googleCalendarEventsToShow = googleCalendarEvents.filter((googleCalendarEvent) => {
    const hasRoomAlready = rooms.some((room) => {
      return room.source_google_calendar_event_id === googleCalendarEvent.id;
    });

    return !hasRoomAlready;
  });

  const hasAnyContentToShow = googleCalendarEventsToShow.length > 0 || rooms.length > 0;

  // If there are no topics in given day render empty component unless forced to render empty.
  if (!hasAnyContentToShow && !displayEmpty) {
    return null;
  }

  return (
    <UIHolder
      layout="position"
      className={className}
      layoutId={`roomtimeline-${startDate.getTime()}`}
      transition={getSpringTransitionWithDuration(0.6)}
    >
      <UITitle>{niceFormatDate(startDate)}</UITitle>
      {googleCalendarEventsToShow.length > 0 && <GoogleCalendarEventsInDay events={googleCalendarEventsToShow} />}
      <RoomsList rooms={rooms} />
      {rooms?.length === 0 && <EmptyStatePlaceholder description="No topics for this day" icon={<IconCalendar />} />}
    </UIHolder>
  );
})``;

const UIHolder = styled(motion.div)`
  ${GoogleCalendarEventsInDay} {
    margin-bottom: 16px;
  }
`;

const UITitle = styled(ItemTitle)`
  margin-bottom: 16px;
`;
