import { endOfDay, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { sortBy } from "lodash";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useRoomsQuery } from "~frontend/gql/rooms";
import { googleCalendarEventsApi } from "~frontend/requests/googleCalendar";
import { CollapsibleRoomInfo } from "~frontend/ui/rooms/RoomsList/CollapsibleRoomInfo";
import { RoomDetailedInfoFragment } from "~gql";
import { niceFormatDate } from "~shared/dates/format";
import { getDayBoundaries } from "~shared/dates/utils";
import { JsonValue } from "~shared/types";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";
import { getSpringTransitionWithDuration } from "~ui/animations";
import { EmptyStatePlaceholder } from "~ui/empty/EmptyStatePlaceholder";
import { IconCalendar } from "~ui/icons";
import { TextH3 } from "~ui/typo";

import { GoogleCalendarEventsCard } from "./GoogleCalendarEventsCard";

interface Props {
  startDate: Date;
  className?: string;
  displayEmpty?: boolean;
}

type SharedTimelineEntityData = { date: Date; id: string };

type CalendarEventEntity = { type: "event"; event: JsonValue<GoogleCalendarEvent> } & SharedTimelineEntityData;
type RoomEntity = { type: "room"; room: RoomDetailedInfoFragment } & SharedTimelineEntityData;

type CalendarListItem = CalendarEventEntity | RoomEntity;

/**
 * We want to order Google Calendar Events and Rooms by date. It means they can be 'mixed' together.
 *
 * As they're totally different entities, I created `EventOrRoom` type that makes it easy to discover if given entity is
 * room or event.
 *
 * Thus this hooks returns 'mixed' array of both events and room ordered by date making it easy to display it in order
 * in the UI.
 */
function useOrderedEventsAndRooms(startDate: Date): CalendarListItem[] {
  const user = useAssertCurrentUser();
  const [dayStart, dayEnd] = getDayBoundaries(startDate);
  const [rooms = []] = useRoomsQuery({
    where: {
      deadline: {
        _gte: dayStart.toISOString(),
        _lte: dayEnd.toISOString(),
      },
      members: {
        user_id: {
          _eq: user.id,
        },
      },
      // Only show rooms that are created from Google Calendar events
      source_google_calendar_event_id: { _is_null: false },
    },
  });

  const [googleCalendarEvents = []] = googleCalendarEventsApi.use({
    eventsStartDate: startOfDay(startDate),
    eventsEndDate: endOfDay(startDate),
    ignoreRejected: true,
  });

  const googleCalendarEventsToShow = googleCalendarEvents.filter((googleCalendarEvent) => {
    const hasRoomAlready = rooms.some((room) => {
      return room.source_google_calendar_event_id === googleCalendarEvent.id;
    });

    return !hasRoomAlready;
  });

  const googleCalendarEventEntities = googleCalendarEventsToShow.map((googleCalendarEvent): CalendarEventEntity => {
    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: googleCalendarEvent.id!,
      type: "event",
      event: googleCalendarEvent,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      date: new Date(googleCalendarEvent.startTime!),
    };
  });

  const roomEntities = rooms.map((room): RoomEntity => {
    return {
      id: room.id,
      type: "room",
      room,
      date: new Date(room.deadline),
    };
  });

  const roomsAndEvents: CalendarListItem[] = [...googleCalendarEventEntities, ...roomEntities];

  return sortBy(roomsAndEvents, (roomOrEvent) => roomOrEvent.date);
}

export const RoomsTimelineSingleDay = styled(function RoomsTimelineSingleDay({
  startDate,
  className,
  displayEmpty,
}: Props): JSX.Element | null {
  const orderedRoomsAndEvents = useOrderedEventsAndRooms(startDate);

  const hasAnyContentToShow = orderedRoomsAndEvents.length > 0;

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
      <UITitle spezia medium>
        {niceFormatDate(startDate)}
      </UITitle>
      <UIList>
        {orderedRoomsAndEvents.map((eventOrRoom) => {
          if (eventOrRoom.type === "event") {
            return <GoogleCalendarEventsCard key={eventOrRoom.id} event={eventOrRoom.event} />;
          }

          if (eventOrRoom.type === "room") {
            return (
              <CollapsibleRoomInfo key={eventOrRoom.id} room={eventOrRoom.room} topics={eventOrRoom.room.topics} />
            );
          }
        })}
      </UIList>

      {orderedRoomsAndEvents.length === 0 && (
        <EmptyStatePlaceholder description="No topics for this day" icon={<IconCalendar />} />
      )}
    </UIHolder>
  );
})``;

const UIHolder = styled(motion.div)<{}>``;

const UITitle = styled(TextH3)<{}>`
  margin-bottom: 16px;
`;

const UIList = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
