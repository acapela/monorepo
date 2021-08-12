import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { SpaceFragment, UpdatedSpacesQuery, UpdatedSpacesQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { userEntity } from "./user";
import { getType } from "./utils";

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
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToSpaceUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.space);
        });
      },
    },
  },
  (space) => {
    const memberIds = space.membersIds.map((member) => member.user_id);
    return {
      get members() {
        return clientdb.user.query((user) => memberIds.includes(user.id));
      },
      get rooms() {
        return clientdb.room.query((room) => room.space_id === space.id);
      },
      get team() {
        return clientdb.team.findById(space.team_id);
      },
    };
  }
);
