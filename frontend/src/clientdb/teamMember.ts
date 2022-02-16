import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { teamIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { teamMemberSlackEntity } from "@aca/frontend/clientdb/teamMemberSlack";
import { userEntity } from "@aca/frontend/clientdb/user";
import {
  TeamMemberFragment,
  Team_Member_Bool_Exp,
  Team_Member_Constraint,
  Team_Member_Insert_Input,
  Team_Member_Set_Input,
} from "@aca/gql";

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

type TeamMemberConstraints = {
  key: Team_Member_Constraint;
  insert: Team_Member_Insert_Input;
  update: Team_Member_Set_Input;
  where: Team_Member_Bool_Exp;
};

export const teamMemberEntity = defineEntity<TeamMemberFragment>({
  name: "team_member",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamMemberFragment>(teamMemberFragment),
  getDefaultValues: () => ({
    __typename: "team_member",
    timezone: null,
    work_start_hour_in_utc: null,
    work_end_hour_in_utc: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamMemberFragment, TeamMemberConstraints>(teamMemberFragment, {
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
    upsertConstraint: "team_member_id_key",
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
