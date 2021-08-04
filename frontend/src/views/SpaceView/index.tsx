import { useMemo } from "react";
import styled from "styled-components";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { useIsCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { routes } from "~frontend/router";
import { createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomsCriteria } from "~frontend/ui/rooms/filters/filter";
import { RoomFiltersPicker } from "~frontend/ui/rooms/filters/RoomFilters";
import { RoomsGroupedByMembership } from "~frontend/ui/rooms/RoomsList";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { PageMeta } from "~frontend/utils/PageMeta";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { Button } from "~ui/buttons/Button";
import { IconPlusSquare } from "~ui/icons";
import { CenteredContentWithSides } from "~ui/layout/CenteredContentWithSides";
import { SpaceHeader } from "./SpaceHeader";
import { SpaceTools } from "./SpaceTools";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const roomsInCurrentSpaceFilter = useMemo(() => createSpaceFilter(spaceId), [spaceId]);
  const amIMember = useIsCurrentUserSpaceMember(space ?? undefined);

  const rooms = space?.rooms ?? [];

  const [filteredRooms, { setCriteria, addedCriteria }] = useRoomsCriteria(rooms, [roomsInCurrentSpaceFilter]);

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

  const spaceMembers = space?.members.map((member) => member.user) ?? [];

  return (
    <>
      {space && <PageMeta title={space.name} />}
      <UIContainer isNarrow>
        <CenteredContentWithSides rightNode={space && <SpaceTools space={space} />}>
          <AvatarList users={spaceMembers} size="medium" />
        </CenteredContentWithSides>
        {space && <SpaceHeader space={space} />}

        <CenteredContentWithSides
          rightNode={
            <UIFlyingCreateRoomButton
              onClick={onCreate}
              iconPosition="start"
              icon={<IconPlusSquare />}
              isDisabled={!amIMember && { reason: `You have to be space member to add new room` }}
            >
              New Room
            </UIFlyingCreateRoomButton>
          }
        >
          <RoomFiltersPicker onFiltersChange={setCriteria} filters={addedCriteria} />
        </CenteredContentWithSides>

        <UIRooms>
          <RoomsGroupedByMembership rooms={filteredRooms} />
        </UIRooms>
      </UIContainer>
    </>
  );
}

const UIContainer = styled(SpacedAppLayoutContainer)<{}>`
  position: relative;

  ${SpaceHeader} {
    margin-bottom: 32px;
    margin-top: 32px;
  }

  ${RoomFiltersPicker} {
    display: flex;
    justify-content: flex-end;
  }
`;

const UIRooms = styled.div<{}>`
  margin-top: 32px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UIFlyingCreateRoomButton = styled(Button)<{}>``;
