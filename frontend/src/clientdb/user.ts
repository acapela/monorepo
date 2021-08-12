import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { UserFragment, UpdatedUsersQuery, UpdatedUsersQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { getType } from "./utils";

const userFragment = gql`
  fragment User on user {
    id
    name
    email
    avatar_url
    updated_at
  }
`;

const [, { subscribe: subscribeToUserUpdates }] = createQuery<UpdatedUsersQuery, UpdatedUsersQueryVariables>(
  () => gql`
    ${userFragment}

    query UpdatedUsers($lastSyncDate: timestamptz) {
      user(where: { updated_at: { _gte: $lastSyncDate } }) {
        ...User
      }
    }
  `
);

export const userEntity = defineEntity(
  {
    type: getType<UserFragment>(),
    name: "space",
    getCacheKey: (space) => space.id,
    sync: {
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToUserUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.user);
        });
      },
    },
  },
  (user) => {
    return {
      get createdSpaces() {
        return clientdb.space.query((space) => space.creator_id === user.id);
      },
    };
  }
);
