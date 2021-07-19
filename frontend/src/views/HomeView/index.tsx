import styled from "styled-components";
import { useMemo } from "react";
import { TextH2, TextH3 } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { createOpenRoomFilter, createUserFilter } from "~frontend/ui/rooms/filters/factories";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { CreateRoomButton } from "./CreateRoomButton";

const openRoomFilter = createOpenRoomFilter(true);

export function HomeView() {
  const user = useAssertCurrentUser();

  const currentUserFilter = useMemo(() => createUserFilter(user), [user]);

  const [roomQuery, setFilters] = useRoomFilterVariables([openRoomFilter]);

  return (
    <UIHolder>
      <UISearchWrapper>
        <SearchBar />
      </UISearchWrapper>
      <UIContent>
        <RoomFilters onFiltersChange={setFilters} initialFilters={[currentUserFilter]} />
        <FilteredRoomsList query={roomQuery} />
      </UIContent>

      <UIFlyingNewRoomButton />
    </UIHolder>
  );
}

const UIHolder = styled(Container)``;

const UIContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${RoomFilters} {
    margin-bottom: 32px;
  }

  ${FilteredRoomsList} {
    margin-bottom: 32px;
    max-width: 800px;
    width: 100%;
  }
`;

const UISearchWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const UIFlyingNewRoomButton = styled(CreateRoomButton)`
  position: absolute;
  bottom: 24px;
  right: 24px;
`;
