import styled from "styled-components";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { createOpenRoomFilter, createUserFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { CreateRoomButton } from "./CreateRoomButton";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useMemo } from "react";

const openRoomFilter = createOpenRoomFilter(true);

export function HomeView() {
  const user = useAssertCurrentUser();

  const currentUserFilter = useMemo(() => createUserFilter(user), [user]);

  const [roomQuery] = useRoomFilterVariables([openRoomFilter, currentUserFilter]);

  return (
    <UIHolder isNarrow>
      <UIContent>
        <RoomsGroupedByActivities query={roomQuery} />
      </UIContent>
      <FlyingCreateRoomButton />
    </UIHolder>
  );
}

const UIHolder = styled(SpacedAppLayoutContainer)``;

const UIContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${RoomFilters} {
    margin-bottom: 32px;
    align-self: center;
  }

  ${RoomsGroupedByActivities} {
    margin-bottom: 32px;
    width: 100%;
  }
`;

const FlyingCreateRoomButton = styled(CreateRoomButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
