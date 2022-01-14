import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { teamIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { userEntity } from "@aca/frontend/clientdb/user";
import {
  UserGroupFragment,
  UserGroupMemberFragment,
  User_Group_Bool_Exp,
  User_Group_Constraint,
  User_Group_Insert_Input,
  User_Group_Member_Insert_Input,
  User_Group_Set_Input,
} from "@aca/gql";

const userGroupFragment = gql`
  fragment UserGroup on user_group {
    id
    name
    team_id
    updated_at
  }
`;

type UserGroupConstraints = {
  key: User_Group_Constraint;
  insert: User_Group_Insert_Input;
  update: User_Group_Set_Input;
  where: User_Group_Bool_Exp;
};

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
  sync: createHasuraSyncSetupFromFragment<UserGroupFragment, UserGroupConstraints>(userGroupFragment, {
    insertColumns: ["id", "team_id", "name", "created_at", "updated_at"],
    updateColumns: ["name"],
    upsertConstraint: "user_group_pkey",
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
  sync: createHasuraSyncSetupFromFragment<
    UserGroupMemberFragment,
    {
      insert: User_Group_Member_Insert_Input;
    }
  >(userGroupMemberFragment, {
    insertColumns: ["id", "user_group_id", "user_id", "created_at", "updated_at"],
  }),
}).addConnections((userGroupMember, { getEntity }) => ({
  get user() {
    return getEntity(userEntity).findById(userGroupMember.user_id);
  },
}));

export type UserGroupMemberEntity = EntityByDefinition<typeof userGroupMemberEntity>;
