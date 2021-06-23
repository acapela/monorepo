import { endOfDay, startOfDay } from "date-fns";
import styled from "styled-components";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";
import { PopPresenceAnimator } from "~ui/animations";
import { googleCalendarEventsApi } from "~frontend/requests/googleCalendar";
import { GoogleCalendarEventsCard } from "./GoogleCalendarEventsCard";

interface Props {
  events: GoogleCalendarEvent[];
  className?: string;
}

export const GoogleCalendarEventsInDay = styled(function GoogleCalendarEventsInDay({ events, className }: Props) {
  return (
    <UIHolder layout="position" className={className}>
      {events.map((event) => {
        return <GoogleCalendarEventsCard key={event.id} event={event} />;
      })}
    </UIHolder>
  );
})``;

const UIHolder = styled(PopPresenceAnimator)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`;
