import { differenceInSeconds } from "date-fns";
import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { DesktopUserFragment, User_Bool_Exp, User_Set_Input } from "@aca/gql";

import { userSlackInstallationEntity } from "./userSlackInstallation";

const userFragment = gql`
  fragment DesktopUser on user {
    id
    name
    email
    avatar_url
    is_slack_auto_resolve_enabled
    updated_at
    created_at
  }
`;

type UserConstraints = {
  update: User_Set_Input;
  where: User_Bool_Exp;
};

export const userEntity = defineEntity<DesktopUserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopUserFragment>(userFragment),
  getDefaultValues: () => ({
    __typename: "user",
    has_slack_installation: null,
    avatar_url: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopUserFragment, UserConstraints>(userFragment, {
    updateColumns: ["is_slack_auto_resolve_enabled"],
  }),
}).addConnections((user, { getEntity }) => {
  return {
    get slackInstallation() {
      return getEntity(userSlackInstallationEntity).query({ user_id: user.id }).first ?? null;
    },
    get isNew() {
      return Math.abs(differenceInSeconds(new Date(), new Date(user.created_at))) < 5;
    },
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
