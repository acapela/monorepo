import styled from "styled-components";

import { trackEvent } from "~frontend/analytics/tracking";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { createRoom } from "~frontend/gql/rooms";
import { useCurrentTeamMembers } from "~frontend/gql/user";
import { openRoomInputPrompt } from "~frontend/rooms/create/openRoomInputPrompt";
import { routes } from "~frontend/router";
import { niceFormatDateTime } from "~shared/dates/format";
import { tryParseStringDate } from "~shared/dates/parseJSONWithDates";
import { JsonValue } from "~shared/types";
import { GoogleCalendarEvent } from "~shared/types/googleCalendar";
import { Button } from "~ui/buttons/Button";
import { CardBase } from "~ui/card/Base";
import { ValueDescriptor } from "~ui/meta/ValueDescriptor";
import { GoogleCalendarIcon } from "~ui/social/GoogleCalendarIcon";
import { hoverTransition } from "~ui/transitions";
import { TextH4 } from "~ui/typo";

interface Props {
  event: JsonValue<GoogleCalendarEvent>;
  className?: string;
}

export const GoogleCalendarEventsCard = styled(function GoogleCalendarEventsCard({
  event,
  className,
}: Props): JSX.Element {
  const user = useAssertCurrentUser();
  const currentTeamMembers = useCurrentTeamMembers();
  const deadline = tryParseStringDate(event.startTime) ?? undefined;

  const participatingTeamMembers = currentTeamMembers.filter((teamMember) => {
    if (!teamMember.email) return false;

    return event.participantEmails.includes(teamMember.email);
  });

  async function handleCreateRoom(): Promise<void> {
    const createRoomInput = await openRoomInputPrompt({
      name: event.title,
      deadline,
      participantsIds: participatingTeamMembers.map((member) => member.id),
    });

    if (createRoomInput === null) {
      return;
    }

    const [room] = await createRoom({
      input: {
        name: createRoomInput.name,
        deadline: createRoomInput.deadline?.toISOString(),
        space_id: createRoomInput.spaceId,
        source_google_calendar_event_id: event.id,
        recurrance_interval_in_days: createRoomInput.recurranceIntervalInDays,
        owner_id: user.id,
        members: {
          data: createRoomInput.participantsIds.map((userId) => {
            return { user_id: userId };
          }),
        },
      },
    });

    if (!room) return;
    trackEvent("Created Room", {
      origin: "calendar",
      roomId: room.id,
      roomName: createRoomInput.name,
      roomDeadline: new Date(createRoomInput.deadline),
      spaceId: createRoomInput.spaceId,
      numberOfInitialMembers: createRoomInput.participantsIds.length,
      isRecurring: !!createRoomInput.recurranceIntervalInDays,
    });
    routes.spaceRoom.push({ spaceId: createRoomInput.spaceId, roomId: room.id });
  }

  return (
    <>
      <UIHolder className={className}>
        <UIInfo>
          <UIName spezia medium>
            {event.title}
            <GoogleCalendarIcon data-tooltip="Connected to Google Calendar event" />
          </UIName>
          {deadline && (
            <UIMeta>
              <ValueDescriptor keyNode="Due date" value={niceFormatDateTime(deadline)} />
            </UIMeta>
          )}
        </UIInfo>
        <UIActions>
          <Button onClick={handleCreateRoom}>Create Room</Button>
        </UIActions>
      </UIHolder>
    </>
  );
})``;

const UIHolder = styled(CardBase)<{}>`
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 84px;

  ${() => UIInfo} {
    opacity: 0.4;
  }

  &:hover ${() => UIInfo} {
    opacity: 1;
  }
`;

const UIInfo = styled.div<{}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  will-change: opacity;

  ${hoverTransition("opacity")};
`;

const UIName = styled(TextH4)<{}>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
`;

const UIMeta = styled.div<{}>`
  padding-top: 16px;
`;

const UIActions = styled.div<{}>``;
