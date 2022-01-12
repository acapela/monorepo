import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { userEntity } from "@aca/frontend/clientdb/user";
import { getFragmentKeys } from "@aca/frontend/clientdb/utils/analyzeFragment";
import { teamIdContext } from "@aca/frontend/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "@aca/frontend/clientdb/utils/sync";
import { UserGroupFragment, UserGroupMemberFragment } from "@aca/gql";

const userGroupFragment = gql`
  fragment UserGroup on user_group {
    id
    name
    team_id
    updated_at
  }
`;

export const userGroupEntity = defineEntity<UserGroupFragment>({
  name: "user_group",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<UserGroupFragment>(userGroupFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "user_group",
    team_id: getContextValue(teamIdContext) ?? undefined,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<UserGroupFragment>(userGroupFragment, {
    insertColumns: ["id", "team_id", "name", "created_at", "updated_at"],
    updateColumns: ["name"],
    teamScopeCondition: (teamId) => ({ team_id: { _eq: teamId } }),
  }),
}).addConnections((userGroup, { getEntity }) => ({
  get members() {
    return getEntity(userGroupMemberEntity).query({ user_group_id: userGroup.id });
  },
}));

export type UserGroupEntity = EntityByDefinition<typeof userGroupEntity>;

const userGroupMemberFragment = gql`
  fragment UserGroupMember on user_group_member {
    id
    updated_at
    user_group_id
    user_id
  }
`;

export const userGroupMemberEntity = defineEntity<UserGroupMemberFragment>({
  name: "user_group_member",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<UserGroupMemberFragment>(userGroupMemberFragment),
  getDefaultValues: () => ({
    __typename: "user_group_member",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<UserGroupMemberFragment>(userGroupMemberFragment, {
    insertColumns: ["id", "user_group_id", "user_id", "created_at", "updated_at"],
    updateColumns: [],
  }),
}).addConnections((userGroupMember, { getEntity }) => ({
  get user() {
    return getEntity(userEntity).findById(userGroupMember.user_id);
  },
}));

export type UserGroupMemberEntity = EntityByDefinition<typeof userGroupMemberEntity>;
