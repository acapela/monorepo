import styled from "styled-components";
import { useCreateRoomMutation } from "~frontend/gql/rooms";
import { useIsCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { routes } from "~frontend/router";
import { openUIPrompt } from "~frontend/utils/prompt";
import { Button } from "~ui/buttons/Button";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { useMemo } from "react";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByMembership } from "~frontend/ui/rooms/RoomsList";
import { createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { IconPlusSquare } from "~ui/icons";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { SpaceHeader } from "./SpaceHeader";
import { CenteredContentWithSides } from "~ui/layout/CenteredContentWithSides";
import { SpaceTools } from "./SpaceTools";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { PageMeta } from "~frontend/utils/PageMeta";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const roomsInCurrentSpaceFilter = useMemo(() => createSpaceFilter(spaceId), [spaceId]);
  const amIMember = useIsCurrentUserSpaceMember(space ?? undefined);

  const [roomQuery, setFilters] = useRoomFilterVariables([roomsInCurrentSpaceFilter]);

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
          <UIFilters onFiltersChange={setFilters} />
        </CenteredContentWithSides>

        <UIRooms>
          <RoomsGroupedByMembership query={roomQuery} />
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
`;

const UIFilters = styled(RoomFilters)<{}>`
  display: flex;
  justify-content: flex-end;
`;

const UIRooms = styled.div<{}>`
  margin-top: 32px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const UIFlyingCreateRoomButton = styled(Button)<{}>``;
