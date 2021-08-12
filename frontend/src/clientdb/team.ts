import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { TeamFragment, UpdatedTeamsQuery, UpdatedTeamsQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { userEntity } from "./user";
import { getType } from "./utils";

const teamFragment = gql`
  fragment Team on team {
    id
    name
    slug
    owner_id
    updated_at
    membershipsIds: memberships {
      user_id
    }
  }
`;

const [, { subscribe: subscribeToSpaceUpdates }] = createQuery<UpdatedTeamsQuery, UpdatedTeamsQueryVariables>(
  () => gql`
    ${teamFragment}

    query UpdatedTeams($lastSyncDate: timestamptz) {
      team(where: { updated_at: { _gte: $lastSyncDate } }) {
        ...Team
      }
    }
  `
);

export const teamEntity = defineEntity(
  {
    type: getType<TeamFragment>(),
    name: "team",
    getCacheKey: (space) => space.id,
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToSpaceUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.team);
        });
      },
    },
  },
  (team) => {
    const memberIds = team.membershipsIds.map((member) => member.user_id);
    return {
      get members() {
        return clientdb.user.query((user) => memberIds.includes(user.id));
      },
      get spaces() {
        return clientdb.space.query((space) => space.team_id === team.id);
      },
    };
  }
);
