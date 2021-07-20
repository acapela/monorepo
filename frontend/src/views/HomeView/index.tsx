import styled from "styled-components";
import { useMemo } from "react";
import { TextH2, TextH3 } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { createOpenRoomFilter, createUserFilter } from "~frontend/ui/rooms/filters/factories";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { CreateRoomButton } from "./CreateRoomButton";
import { SpacedAppLayoutContainer } from "~frontend/layouts/AppLayout/SpacedAppLayoutContainer";

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
      <UIMainSection>
        <UIGreeting>
          <TextH2 speziaExtended>Hello, {user.name}!</TextH2>
          <TextH3 spezia>Here are rooms & topics with recent activity.</TextH3>
        </UIGreeting>
        <CreateRoomButton />
      </UIMainSection>
      <RoomFilters onFiltersChange={setFilters} initialFilters={[currentUserFilter]} />
      <FilteredRoomsList query={roomQuery} />
    </UIHolder>
  );
}

const UIHolder = styled(SpacedAppLayoutContainer)`
  ${RoomFilters} {
    margin-bottom: 32px;
  }

  ${FilteredRoomsList} {
    margin-bottom: 32px;
  }
`;

const UISearchWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const UIMainSection = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 40px;
  align-items: start;
`;

const UIGreeting = styled.div`
  ${TextH2} {
    margin-bottom: 1rem;
  }

  margin-bottom: 2rem;
`;
