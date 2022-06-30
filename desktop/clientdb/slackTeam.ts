import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { SlackTeamFragment } from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const slackTeamFragment = gql`
  fragment SlackTeam on slack_team {
    id
    updated_at
    created_at
    slack_team_id
    team_info_data
  }
`;

export const slackTeamEntity = defineEntity<SlackTeamFragment>({
  name: "slack_team",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<SlackTeamFragment>(slackTeamFragment),
  sync: createHasuraSyncSetupFromFragment<SlackTeamFragment>(slackTeamFragment),
});

export type SlackTeamEntity = EntityByDefinition<typeof slackTeamEntity>;
