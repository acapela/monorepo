import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb";
import { UserFragment } from "~gql";

import { taskEntity } from "./task";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
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
    // TODO currently clientdb is not working for user updates, as user insert is not allowed on db (so upsert as well)
    insertColumns: [],
    updateColumns: [],
  }),
}).addConnections((user, { getEntity, getContextValue }) => {
  return {
    tasks: getEntity(taskEntity).query({ user_id: user.id }),
    get isCurrentUser() {
      return user.id === getContextValue(userIdContext);
    },
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
