import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useGetSpacesQuery } from "~frontend/gql/spaces";
import { NoticeLabel } from "~frontend/ui/NoticeLabel";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { useAssertCurrentTeamId } from "~frontend/authentication/useCurrentUser";

export function SpacesList() {
  const teamId = useAssertCurrentTeamId();
  const [data, { loading }] = useGetSpacesQuery.subscription({ teamId });

  const spacesList = data?.space ?? [];

  const hasNoSpaces = !loading && spacesList.length === 0;

  return (
    <UIHolder>
      <PageTitle>Your Spaces</PageTitle>
      {hasNoSpaces && <NoticeLabel>No spaces yet</NoticeLabel>}
      {spacesList.length > 0 && (
        <UISpaces>
          {spacesList.map((space) => {
            return <SpaceCard key={space.id} space={space} />;
          })}
        </UISpaces>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${PageTitle} {
    margin-bottom: 2rem;
  }
`;

const UISpaces = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3rem;
`;
