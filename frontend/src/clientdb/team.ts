import gql from "graphql-tag";

import { TeamFragment, UpdatedTeamsQuery, UpdatedTeamsQueryVariables } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { spaceEntity } from "./space";
import { userEntity } from "./user";
import { getType } from "./utils";
import { clientdb } from ".";

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
    keyField: "id",
    sync: {
      initPromise: () => renderedApolloClientPromise,
      pull({ lastSyncDate, updateItems }) {
        return subscribeToSpaceUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
          updateItems(newData.team);
        });
      },
    },
  },
  (team, { getEntity }) => {
    const memberIds = team.membershipsIds.map((member) => member.user_id);
    return {
      get members() {
        return getEntity(userEntity).query((user) => memberIds.includes(user.id));
      },
      get spaces() {
        return getEntity(spaceEntity).query((space) => space.team_id === team.id);
      },
    };
  }
);
