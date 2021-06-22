import styled from "styled-components";
import { slugify } from "~shared/slugify";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { isCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { Container } from "~ui/layout/Container";
import { SecondaryText } from "~ui/typo";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { useMemo, useRef } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { Toggle } from "~ui/toggle";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const spaceFilter = useMemo(() => createSpaceFilter(spaceId), [spaceId]);
  const amIMember = isCurrentUserSpaceMember(space ?? undefined);

  const [roomQuery, setFilters] = useRoomFilterVariables([spaceFilter]);

  const [createRoom] = useCreateRoomMutation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  async function onCreate() {
    const roomName = await openUIPrompt({
      title: "Room name",
      placeholder: "Daily standup...",
      submitLabel: "Create room",
      anchor: {
        ref: buttonRef,
        placement: "bottom-end",
      },
      validateInput: createLengthValidator("Room name", 3),
    });

    if (!roomName?.trim()) {
      return;
    }

    const slug = slugify(roomName);

    const [room] = await createRoom({ input: { name: roomName, space_id: spaceId, slug } });

    const roomId = room?.id;

    if (!roomId) {
      return;
    }

    routes.spaceRoom.push({ spaceId, roomId });
  }

  return (
    <>
      <Container>
        <UIHolder>
          <UISpace>{space && <SpaceCard space={space} />}</UISpace>
          <UIContent>
            <UITitle>
              <Button
                ref={buttonRef}
                onClick={onCreate}
                isDisabled={!amIMember && { reason: `You have to be space member to add new room` }}
              >
                Create room
              </Button>
            </UITitle>

            <RoomFilters onFiltersChange={setFilters} />
            <UIRooms>
              <UIRoomsHeader>
                <SecondaryText>Rooms</SecondaryText>
                <UIClosedRoomsFilter>
                  <SecondaryText>Closed</SecondaryText>
                  <Toggle size="small" onSet={() => console.log("set")} onUnset={() => console.log("unset")} />
                </UIClosedRoomsFilter>
              </UIRoomsHeader>
              <FilteredRoomsList query={roomQuery} />
            </UIRooms>
          </UIContent>
        </UIHolder>
      </Container>
    </>
  );
}

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-gap: 4rem;
`;

const UISpace = styled.div``;

const UIContent = styled.div``;

const UITitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const UIRooms = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UIRoomsHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const UIFilters = styled.div``;

const UIClosedRoomsFilter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
