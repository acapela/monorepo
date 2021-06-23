import styled from "styled-components";
import { setColorOpacity } from "~shared/colors";
import { niceFormatDateTime } from "~shared/dates/format";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";
import { PopPresenceAnimator } from "~ui/animations";
import { borderRadius } from "~ui/baseStyles";
import { Button } from "~ui/buttons/Button";
import { PRIMARY_COLOR } from "~ui/colors";
import { SecondaryText } from "~ui/typo";
import { routes } from "~frontend/../routes";
import { createRoom } from "~frontend/gql/rooms";
import { openRoomInputPrompt } from "~frontend/rooms/create/openRoomInputPrompt";

interface Props {
  event: GoogleCalendarEvent;
  className?: string;
}

export const GoogleCalendarEventsCard = styled(function GoogleCalendarEventsCard({ event, className }: Props) {
  async function handleCreateRoom() {
    const createRoomInput = await openRoomInputPrompt({ name: event.title, deadline: event.startTime });

    if (createRoomInput === null) {
      return;
    }

    const [room] = await createRoom({
      input: {
        name: createRoomInput.name,
        deadline: createRoomInput.deadline?.toISOString(),
        space_id: createRoomInput.spaceId,
        source_google_calendar_event_id: event.id,
        slug: createRoomInput.slug,
      },
    });

    if (!room) return;
  }

  return (
    <>
      <UIHolder layout="position" className={className}>
        <UIInfo>
          <UIName>{event.title}</UIName>
          {event.startTime && <UIDate>{niceFormatDateTime(event.startTime)}</UIDate>}
        </UIInfo>
        <UIActions>
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </UIActions>
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled(PopPresenceAnimator)`
  display: flex;
  align-items: center;
  position: relative;
  padding: 1rem;
  background-color: ${setColorOpacity(PRIMARY_COLOR, 0.2)};
  ${borderRadius.card};
`;

const UIInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const UIName = styled(SecondaryText)`
  margin-bottom: 8px;
  font-weight: bold;
`;

const UIDate = styled(SecondaryText)``;

const UIActions = styled.div``;
