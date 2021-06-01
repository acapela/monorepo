import styled from "styled-components";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { RecentTopics } from "./RecentTopics/RecentTopics";
import { TeamMembersManager } from "./TeamMembersManager";

export function HomeView() {
  return (
    <Container>
      <UISearchWrapper>
        <SearchBar />
      </UISearchWrapper>
      <RecentTopics />
      <TeamMembersManager />
    </Container>
  );
}

const UISearchWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
`;
