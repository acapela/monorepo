import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { DesktopUserSlackInstallationFragment } from "@aca/gql";
import { USER_SCOPES, isSubsetOf } from "@aca/shared/slack";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

import { userSlackChannelsByTeamEntity } from "./userSlackChannelsByTeam";

const userSlackInstallationFragment = gql`
  fragment DesktopUserSlackInstallation on user_slack_installation {
    id
    user_id
    updated_at
    created_at
    user_scopes
    team_id
    team_name
  }
`;

export const userSlackInstallationEntity = defineEntity<DesktopUserSlackInstallationFragment>({
  name: "user_slack_installation",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<DesktopUserSlackInstallationFragment>(userSlackInstallationFragment),
  sync: createHasuraSyncSetupFromFragment<DesktopUserSlackInstallationFragment>(userSlackInstallationFragment),
}).addView((installation, { db: { entity } }) => ({
  get hasAllScopes() {
    return isSubsetOf(USER_SCOPES, installation.user_scopes);
  },
  get channelFilters() {
    return entity(userSlackChannelsByTeamEntity).query({ user_slack_installation_id: installation.id });
  },
}));

export type UserSlackInstallationEntity = EntityByDefinition<typeof userSlackInstallationEntity>;
