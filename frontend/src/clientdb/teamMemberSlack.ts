import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { getFragmentKeys } from "@aca/frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "@aca/frontend/clientdb/utils/sync";
import { TeamMemberSlackFragment } from "@aca/gql";

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
  sync: createHasuraSyncSetupFromFragment<TeamMemberSlackFragment>(teamMemberSlackFragment, {
    insertColumns: [],
    updateColumns: [],
    teamScopeCondition: (teamId) => ({ team_member: { team_id: { _eq: teamId } } }),
  }),
});
