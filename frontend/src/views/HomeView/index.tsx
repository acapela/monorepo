import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { RecentTopics } from "./RecentTopics/RecentTopics";

export function HomeView() {
  const user = useAssertCurrentUser();

  return (
    <UIHolder>
      <UISearchWrapper>
        <SearchBar />
      </UISearchWrapper>
      <UIGreeting>
        <PageTitle>Hello, {user.name}!</PageTitle>
        <div>Here are rooms & topics with recent activity.</div>
      </UIGreeting>
      <RecentTopics />
    </UIHolder>
  );
}

const UIHolder = styled(Container)`
  ${RecentTopics} {
    margin-bottom: 2rem;
  }
`;

const UISearchWrapper = styled.div`
  margin: 0 auto;
  margin-bottom: 3rem;
`;

const UIGreeting = styled.div`
  ${PageTitle} {
    margin-bottom: 1rem;
  }

  margin-bottom: 2rem;
`;
