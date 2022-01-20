import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { UserFragment } from "@aca/gql";

const userFragment = gql`
  fragment User on user {
    id
    name
    email
    avatar_url
    updated_at
    created_at
  }
`;

export const userEntity = defineEntity<UserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<UserFragment>(userFragment),
  getDefaultValues: () => ({
    __typename: "user",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<UserFragment>(userFragment),
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
