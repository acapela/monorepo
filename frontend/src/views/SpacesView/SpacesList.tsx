import { gql } from "@apollo/client";
import styled from "styled-components";
import { TextH3, TextBody14 } from "~ui/typo";
import { NoticeLabel } from "~frontend/ui/NoticeLabel";
import { SpaceCard } from "~frontend/views/SpacesView/SpaceCard";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { groupByFilter } from "~shared/groupByFilter";
import { CategoryNameLabel } from "~ui/theme/functional";
import { createQuery } from "~frontend/gql/utils";
import { useAssertCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { SpacesListQuery, SpacesListQueryVariables } from "~gql";

const [useSpaceListQuery] = createQuery<SpacesListQuery, SpacesListQueryVariables>(
  () => gql`
    ${SpaceCard.fragments.space}

    query SpacesList($teamId: uuid!) {
      spaces: space(where: { team_id: { _eq: $teamId } }) {
        members {
          space_id
          user_id
          user {
            id
          }
        }
        ...SpaceCard_space
      }
    }
  `
);

export function SpacesList() {
  const teamId = useAssertCurrentTeamId();
  const [spaces = [], { loading }] = useSpaceListQuery({ teamId });
  const user = useAssertCurrentUser();

  const hasNoSpaces = !loading && spaces.length === 0;

  const [mySpaces, notJoinedSpaces] = groupByFilter(spaces, (space) =>
    space.members.some((member) => member.user.id === user.id)
  );

  return (
    <UIHolder>
      {hasNoSpaces && <NoticeLabel>No spaces yet</NoticeLabel>}
      {mySpaces.length > 0 && (
        <UISpacesGroup key="mine">
          <CategoryNameLabel>Joined spaces</CategoryNameLabel>

          <UISpaces>
            {mySpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </UISpaces>
        </UISpacesGroup>
      )}
      {notJoinedSpaces.length > 0 && (
        <UISpacesGroup key="to-join">
          <CategoryNameLabel>Other spaces</CategoryNameLabel>
          <UISpaces>
            {notJoinedSpaces.map((space) => (
              <SpaceCard key={space.id} space={space} />
            ))}
          </UISpaces>
        </UISpacesGroup>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  ${TextH3} {
    margin-bottom: 2rem;
  }
`;

const UISpacesGroup = styled.div<{}>`
  margin-bottom: 48px;

  ${TextBody14} {
    margin-bottom: 16px;
  }
`;

const UISpaces = styled.div<{}>`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-gap: 3rem;
`;
