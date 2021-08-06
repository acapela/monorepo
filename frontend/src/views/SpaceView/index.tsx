import { useMemo } from "react";
import styled from "styled-components";
import { useIsCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";
import { createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomsCriteria } from "~frontend/ui/rooms/filters/filter";
import { RoomFiltersPicker } from "~frontend/ui/rooms/filters/RoomFilters";
import { RoomsGroupedByMembership } from "~frontend/ui/rooms/RoomsList";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { PageMeta } from "~frontend/utils/PageMeta";
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
            space && (
              <CreateRoomButton
                buttonProps={{ isDisabled: !amIMember && { reason: `You have to be space member to add new room` } }}
                promptProps={{ spaceId: space.id, hideSpaceInput: true }}
              >
                New Room
              </CreateRoomButton>
            )
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
