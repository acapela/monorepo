import styled from "styled-components";
import { useIsCurrentUserSpaceMember, useSingleSpaceQuery } from "~frontend/gql/spaces";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { useMemo } from "react";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByMembership } from "~frontend/ui/rooms/RoomsList";
import { createSpaceFilter } from "~frontend/ui/rooms/filters/factories";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { SpaceHeader } from "./SpaceHeader";
import { CenteredContentWithSides } from "~ui/layout/CenteredContentWithSides";
import { SpaceTools } from "./SpaceTools";
import { AvatarList } from "~frontend/ui/users/AvatarList";
import { PageMeta } from "~frontend/utils/PageMeta";
import { CreateRoomButton } from "~frontend/ui/rooms/CreateRoomButton";

interface Props {
  spaceId: string;
}

export function SpaceView({ spaceId }: Props) {
  const [space] = useSingleSpaceQuery({ id: spaceId });
  const roomsInCurrentSpaceFilter = useMemo(() => createSpaceFilter(spaceId), [spaceId]);
  const amIMember = useIsCurrentUserSpaceMember(space ?? undefined);

  const [roomQuery, setFilters] = useRoomFilterVariables([roomsInCurrentSpaceFilter]);

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
            <CreateRoomButton isDisabled={!amIMember && { reason: `You have to be space member to add new room` }}>
              New Room
            </CreateRoomButton>
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
