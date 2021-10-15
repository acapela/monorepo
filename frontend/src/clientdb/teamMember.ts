import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { teamMemberSlackEntity } from "~frontend/clientdb/teamMemberSlack";
import { userEntity } from "~frontend/clientdb/user";
import { getFragmentKeys } from "~frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "~frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "~frontend/clientdb/utils/sync";
import { TeamMemberFragment } from "~gql";

const teamMemberFragment = gql`
  fragment TeamMember on team_member {
    id
    team_id
    user_id
    notify_email
    notify_slack
    updated_at
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
}).addConnections((teamMember, { getEntity }) => ({
  get user() {
    return getEntity(userEntity).findById(teamMember.user_id);
  },
  get teamMemberSlack() {
    return getEntity(teamMemberSlackEntity).findByUniqueIndex("team_member_id", teamMember.id);
  },
}));
