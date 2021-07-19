import styled from "styled-components";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { isCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/routes";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { TextBody } from "~ui/typo";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { useMemo, useState } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { createOpenRoomFilter, createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { IconPlusSquare } from "~ui/icons";
import { Toggle } from "~ui/toggle";
import { zIndex } from "~ui/zIndex";
import { ClientSideOnly } from "~ui/ClientSideOnly";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";

interface Props {
  spaceId: string;
}

const openRoomsFilter = createOpenRoomFilter(true);
const closedRoomsFilter = createOpenRoomFilter(false);

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const roomsInCurrentSpaceFilter = useMemo(() => createSpaceFilter(spaceId), [spaceId]);
  const amIMember = isCurrentUserSpaceMember(space ?? undefined);

  const [roomOpenStatusFilter, setRoomOpenStatusFilter] = useState(openRoomsFilter);

  const [roomQuery, setFilters] = useRoomFilterVariables([roomsInCurrentSpaceFilter, roomOpenStatusFilter]);

  const [createRoom] = useCreateRoomMutation();

  async function onCreate() {
    const roomName = await openUIPrompt({
      title: "Room name",
      placeholder: "Daily standup...",
      submitLabel: "Create room",
      validateInput: createLengthValidator("Room name", 3),
    });

    if (!roomName?.trim()) {
      return;
    }

    const [room] = await createRoom({ input: { name: roomName, space_id: spaceId } });

    const roomId = room?.id;

    if (!roomId) {
      return;
    }

    routes.spaceRoom.push({ spaceId, roomId });
  }

  return (
    <>
      <UIContainer>
        <UIHolder>
          <UISpace>{space && <SpaceCard space={space} isClickable={false} />}</UISpace>
          <UIContent>
            <UIFilters onFiltersChange={setFilters} />
            <UIRooms>
              <UIRoomsHeader>
                <TextBody>Rooms</TextBody>
                <UIClosedRoomsFilter>
                  <TextBody>Closed</TextBody>
                  <Toggle
                    size="small"
                    onSet={() => setRoomOpenStatusFilter(closedRoomsFilter)}
                    onUnset={() => setRoomOpenStatusFilter(openRoomsFilter)}
                  />
                </UIClosedRoomsFilter>
              </UIRoomsHeader>
              <FilteredRoomsList query={roomQuery} />
            </UIRooms>
          </UIContent>
        </UIHolder>
        <ClientSideOnly>
          <UIFlyingCreateRoomButton
            onClick={onCreate}
            iconPosition="start"
            icon={<IconPlusSquare />}
            isDisabled={!amIMember && { reason: `You have to be space member to add new room` }}
          >
            Create room
          </UIFlyingCreateRoomButton>
        </ClientSideOnly>
      </UIContainer>
    </>
  );
}

const UIContainer = styled(SpacedAppLayoutContainer)`
  position: relative;
`;

const UIHolder = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  grid-gap: 4rem;
`;

const UISpace = styled.div``;

const UIContent = styled.div``;

const UIFilters = styled(RoomFilters)`
  display: flex;
  justify-content: flex-end;
`;

const UIRooms = styled.div`
  margin-top: 16px;

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

const UIFlyingCreateRoomButton = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 32px;
  z-index: ${zIndex.FlyingButton};
`;

const UIClosedRoomsFilter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
