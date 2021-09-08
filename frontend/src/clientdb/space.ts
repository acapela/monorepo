import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";
import { SpaceFragment, UpdatedSpacesQuery, UpdatedSpacesQueryVariables } from "~gql";

import { roomEntity } from "./room";
import { teamEntity } from "./team";
import { userEntity } from "./user";
import { getType } from "./utils";
import { clientdb } from ".";

const spaceFragment = gql`
  fragment Space on space {
    id
    name
    slug
    team_id
    creator_id
    updated_at
    membersIds: members {
      user_id
      space_id
    }
  }
`;

const [, { subscribe: subscribeToSpaceUpdates }] = createQuery<UpdatedSpacesQuery, UpdatedSpacesQueryVariables>(
  () => gql`
    ${spaceFragment}

    query UpdatedSpaces($lastSyncDate: timestamptz) {
      space(where: { updated_at: { _gte: $lastSyncDate } }) {
        ...Space
      }
    }
  `
);

export const spaceEntity = defineEntity(
  {
    type: getType<SpaceFragment>(),
    name: "space",
    getCacheKey: (space) => space.id,
    keyField: "id",
    sync: {
      initPromise: () => renderedApolloClientPromise,
      pull({ lastSyncDate, updateItems }) {
        return subscribeToSpaceUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
          updateItems(newData.space);
        });
      },
    },
  },
  (space, { getEntity }) => {
    const memberIds = space.membersIds.map((member) => member.user_id);
    return {
      get members() {
        return getEntity(userEntity).query((user) => memberIds.includes(user.id));
      },
      get rooms() {
        return getEntity(roomEntity).query((room) => room.space_id === space.id);
      },
      get team() {
        return getEntity(teamEntity).findById(space.team_id);
      },
    };
  }
);
