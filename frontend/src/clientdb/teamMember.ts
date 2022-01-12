import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { teamMemberSlackEntity } from "@aca/frontend/clientdb/teamMemberSlack";
import { userEntity } from "@aca/frontend/clientdb/user";
import { getFragmentKeys } from "@aca/frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "@aca/frontend/clientdb/utils/sync";
import { TeamMemberFragment } from "@aca/gql";

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
    timezone
    work_start_hour_in_utc
    work_end_hour_in_utc
  }
`;

export const teamMemberEntity = defineEntity<TeamMemberFragment>({
  name: "team_member",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamMemberFragment>(teamMemberFragment),
  getDefaultValues: () => ({
    __typename: "team_member",
    timezone: undefined,
    work_start_hour_in_utc: undefined,
    work_end_hour_in_utc: undefined,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamMemberFragment>(teamMemberFragment, {
    insertColumns: [
      "id",
      "team_id",
      "user_id",
      "notify_email",
      "notify_slack",
      "timezone",
      "work_start_hour_in_utc",
      "work_end_hour_in_utc",
    ],
    updateColumns: ["notify_email", "notify_slack", "timezone", "work_start_hour_in_utc", "work_end_hour_in_utc"],
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
