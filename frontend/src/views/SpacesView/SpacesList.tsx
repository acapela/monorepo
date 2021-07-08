import styled from "styled-components";
import { PageTitle } from "~ui/typo";
import { useTeamSpacesQuery } from "~frontend/gql/spaces";
import { NoticeLabel } from "~frontend/ui/NoticeLabel";
import { SpaceCard } from "~frontend/ui/spaces/SpaceCard";
import { useAssertCurrentTeamId, useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { groupByFilter } from "~shared/groupByFilter";
import { TextMeta14Mono } from "~frontend/../../ui/theme";

export function SpacesList() {
  const teamId = useAssertCurrentTeamId();
  const [spacesList = [], { loading }] = useTeamSpacesQuery({ teamId });
  const user = useAssertCurrentUser();

  const hasNoSpaces = !loading && spacesList.length === 0;

  const [mySpaces, notJoinedSpaces] = groupByFilter(spacesList, (space) =>
    space.members.some((member) => member.user.id === user.id)
  );

  return (
    <UIHolder>
      {hasNoSpaces && <NoticeLabel>No spaces yet</NoticeLabel>}
      {mySpaces.length > 0 && (
        <UISpacesGroup key="mine">
          <TextMeta14Mono>Joined spaces</TextMeta14Mono>
          <UISpaces>
            {mySpaces.map((space) => {
              return <SpaceCard key={space.id} space={space} />;
            })}
          </UISpaces>
        </UISpacesGroup>
      )}
      {notJoinedSpaces.length > 0 && (
        <UISpacesGroup key="to-join">
          <TextMeta14Mono>Other spaces</TextMeta14Mono>
          <UISpaces>
            {notJoinedSpaces.map((space) => {
              return <SpaceCard key={space.id} space={space} />;
            })}
          </UISpaces>
        </UISpacesGroup>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  ${PageTitle} {
    margin-bottom: 2rem;
  }
`;

const UISpacesGroup = styled.div`
  margin-bottom: 48px;
`;

const UISpaces = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-gap: 3rem;
`;
