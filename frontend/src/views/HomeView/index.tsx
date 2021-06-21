import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { QueriedRoomsList } from "~frontend/ui/rooms/RoomsList/QueriedRoomsList";
import { useRoomFilterVariables } from "~frontend/ui/rooms/filters/filter";
import { TopicFilters } from "~frontend/ui/rooms/filters/RoomFilters";
import { CreateRoomButton } from "./CreateRoom";

export function HomeView() {
  const user = useAssertCurrentUser();
  const [roomQuery, setFilters] = useRoomFilterVariables();

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
      <TopicFilters onFiltersChange={setFilters} />
      <QueriedRoomsList query={roomQuery} />
    </UIHolder>
  );
}

const UIHolder = styled(Container)`
  ${TopicFilters} {
    margin-bottom: 32px;
  }

  ${QueriedRoomsList} {
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
