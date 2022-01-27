import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { TeamMemberSlackFragment, Team_Member_Slack_Bool_Exp } from "@aca/gql";

const teamMemberSlackFragment = gql`
  fragment TeamMemberSlack on team_member_slack {
    id
    team_member_id
    slack_user_id
    updated_at
    slack_scopes
  }
`;

export const teamMemberSlackEntity = defineEntity<TeamMemberSlackFragment>({
  name: "team_member_slack",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamMemberSlackFragment>(teamMemberSlackFragment),
  uniqueIndexes: ["team_member_id"],
  getDefaultValues: () => ({
    __typename: "team_member_slack",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamMemberSlackFragment, { where: Team_Member_Slack_Bool_Exp }>(
    teamMemberSlackFragment,
    {
      teamScopeCondition: (teamId) => ({ team_member: { team_id: { _eq: teamId } } }),
    }
  ),
});
