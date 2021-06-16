import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { SearchBar } from "~frontend/ui/search/SearchBar";
import { Container } from "~ui/layout/Container";
import { QueriedTopicsList } from "./RecentTopics/RecentTopics";
import { useTopicFilterVariables } from "./RecentTopics/Filters/filter";
import { TopicFilters } from "./RecentTopics/Filters/TopicFilters";

export function HomeView() {
  const user = useAssertCurrentUser();
  const [topicQuery, setFilters] = useTopicFilterVariables();

  return (
    <UIHolder>
      <UISearchWrapper>
        <SearchBar />
      </UISearchWrapper>
      <UIGreeting>
        <PageTitle>Hello, {user.name}!</PageTitle>
        <div>Here are rooms & topics with recent activity.</div>
      </UIGreeting>
      <TopicFilters onFiltersChange={setFilters} />
      <QueriedTopicsList query={topicQuery} />
    </UIHolder>
  );
}

const UIHolder = styled(Container)`
  ${TopicFilters} {
    margin-bottom: 32px;
  }

  ${QueriedTopicsList} {
    margin-bottom: 32px;
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
