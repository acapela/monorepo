import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { UserFragment } from "~gql";

import { taskEntity } from "./task";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const userFragment = gql`
  fragment User on user {
    id
    name
    email
    avatar_url
    updated_at
  }
`;

export const userEntity = defineEntity<UserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<UserFragment>(userFragment),
  getDefaultValues() {
    return {
      __typename: "user",
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<UserFragment>(userFragment, {
    upsertIdKey: "user_pkey",
    insertColumns: ["avatar_url", "name"],
    updateColumns: ["avatar_url", "name"],
  }),
}).addConnections((user, { getEntity }) => {
  return {
    tasks: getEntity(taskEntity).find((task) => task.user_id === user.id),
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
