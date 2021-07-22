import { useMemo } from "react";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import { createOpenRoomFilter, createUserFilter } from "~frontend/ui/rooms/filters/factories";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { CreateRoomButton } from "./CreateRoomButton";

const openRoomFilter = createOpenRoomFilter(true);

export function HomeView() {
  const user = useAssertCurrentUser();

  const currentUserFilter = useMemo(() => createUserFilter(user), [user]);

  const [roomQuery, setFilters] = useRoomFilterVariables([openRoomFilter]);

  return (
    <UIHolder isNarrow>
      <UIContent>
        <RoomFilters onFiltersChange={setFilters} initialFilters={[currentUserFilter]} />
        <FilteredRoomsList query={roomQuery} />
      </UIContent>
      <UIFlyingNewRoomButton />
    </UIHolder>
  );
}

const UIHolder = styled(SpacedAppLayoutContainer)``;

const UIContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${RoomFilters} {
    margin-bottom: 32px;
  }

  ${FilteredRoomsList} {
    margin-bottom: 32px;
    width: 100%;
  }
`;

const UIFlyingNewRoomButton = styled(CreateRoomButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
