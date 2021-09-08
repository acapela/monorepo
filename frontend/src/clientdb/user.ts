import gql from "graphql-tag";

import { UpdatedUsersQuery, UpdatedUsersQueryVariables, UserFragment } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { spaceEntity } from "./space";
import { getType } from "./utils";
import { clientdb } from ".";

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
    name: "user",
    getCacheKey: (space) => space.id,
    keyField: "id",
    sync: {
      initPromise: () => renderedApolloClientPromise,
      pull({ lastSyncDate, updateItems }) {
        return subscribeToUserUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
          updateItems(newData.user);
        });
      },
    },
  },
  (user, { getEntity }) => {
    return {
      get createdSpaces() {
        return getEntity(spaceEntity).query((space) => space.creator_id === user.id);
      },
    };
  }
);
