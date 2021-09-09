import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import { UpdatedUsersQuery, UpdatedUsersQueryVariables, UserFragment } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { spaceEntity } from "./space";

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
      user(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...User
      }
    }
  `
);

export const userEntity = defineEntity<UserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      return subscribeToUserUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.user);
      });
    },
  },
}).addConnections((user, { getEntity }) => {
  return {
    get createdSpaces() {
      return getEntity(spaceEntity).query((space) => space.creator_id === user.id);
    },
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
