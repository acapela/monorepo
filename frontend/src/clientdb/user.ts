import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { UserFragment } from "@aca/gql";

import { taskEntity } from "./task";
import { teamMemberEntity } from "./teamMember";

const userFragment = gql`
  fragment User on user {
    id
    name
    email
    avatar_url
    updated_at
    has_account
    created_at
    is_bot
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
      is_bot: false,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<UserFragment>(userFragment),
}).addConnections((user, { getEntity, getContextValue }) => {
  const connections = {
    tasks: getEntity(taskEntity).query({ user_id: user.id }),
    get isCurrentUser() {
      return user.id === getContextValue(userIdContext);
    },
    get teamMembership() {
      return getEntity(teamMemberEntity).findByUniqueIndex("user_id", user.id);
    },
    get isMemberOfCurrentTeam() {
      return connections.teamMembership?.isMemberOfCurrentTeam ?? false;
    },
  };

  return connections;
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
