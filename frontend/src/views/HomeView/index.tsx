import styled from "styled-components";
import { useMemo } from "react";
import { PageTitle } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { FilteredRoomsList } from "~frontend/ui/rooms/RoomsList";
import { createUserFilter, useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { RoomFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { CreateRoomButton } from "./CreateRoom";

export function HomeView() {
  const user = useAssertCurrentUser();
  const [roomQuery, setFilters] = useRoomFilterVariables();

  const currentUserFilter = useMemo(() => createUserFilter(user), [user]);

  return (
    <UIHolder>
      <UISearchWrapper>
        <SearchBar />
      </UISearchWrapper>
      <UIMainSection>
        <UIGreeting>
          <PageTitle>Hello, {user.name}!</PageTitle>
          <div>Here are rooms & topics with recent activity.</div>
        </UIGreeting>
        <CreateRoomButton />
      </UIMainSection>
      <RoomFilters onFiltersChange={setFilters} initialFilters={[currentUserFilter]} />
      <FilteredRoomsList query={roomQuery} />
    </UIHolder>
  );
}

const UIHolder = styled(Container)`
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
  ${PageTitle} {
    margin-bottom: 1rem;
  }

  margin-bottom: 2rem;
`;
