import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "~clientdb";
import { teamMemberSlackEntity } from "~frontend/clientdb/teamMemberSlack";
import { userEntity } from "~frontend/clientdb/user";
import { getFragmentKeys } from "~frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "~frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "~frontend/clientdb/utils/sync";
import { TeamMemberFragment } from "~gql";

import { teamIdContext } from "./utils/context";

const teamMemberFragment = gql`
  fragment TeamMember on team_member {
    id
    team_id
    user_id
    notify_email
    notify_slack
    updated_at
    has_joined
  }
`;

export const teamMemberEntity = defineEntity<TeamMemberFragment>({
  name: "team_member",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamMemberFragment>(teamMemberFragment),
  getDefaultValues: () => ({
    __typename: "team_member",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamMemberFragment>(teamMemberFragment, {
    insertColumns: ["id", "team_id", "user_id", "notify_email", "notify_slack"],
    updateColumns: ["notify_email", "notify_slack"],
    teamScopeCondition: (teamId) => ({ team_id: { _eq: teamId } }),
  }),
}).addConnections((teamMember, { getEntity, getContextValue }) => ({
  get user() {
    return getEntity(userEntity).findById(teamMember.user_id);
  },
  get teamMemberSlack() {
    return getEntity(teamMemberSlackEntity).findByUniqueIndex("team_member_id", teamMember.id);
  },
  get isMemberOfCurrentTeam() {
    return teamMember.team_id === getContextValue(teamIdContext);
  },
}));

export type TeamMemberEntity = EntityByDefinition<typeof teamMemberEntity>;
