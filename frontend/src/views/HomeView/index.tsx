import { useMemo } from "react";
import styled from "styled-components";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";
import {
  createOpenRoomFilter,
  createUserFilter,
  createSortByLatestActivityFilter,
} from "~frontend/ui/rooms/filters/factories";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomsGroupedByActivities } from "~frontend/ui/rooms/RoomsList";
import { CreateRoomButton } from "./CreateRoomButton";

const openRoomFilter = createOpenRoomFilter(true);
const sortByLatestActivity = createSortByLatestActivityFilter();

export function HomeView() {
  const user = useAssertCurrentUser();

  const currentUserFilter = useMemo(() => createUserFilter(user), [user]);

  const [roomQuery] = useRoomFilterVariables([openRoomFilter, currentUserFilter, sortByLatestActivity]);

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

  ${RoomsGroupedByActivities} {
    margin-top: 40px;
    width: 100%;
  }
`;

const FlyingCreateRoomButton = styled(CreateRoomButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
