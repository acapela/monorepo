import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { ClickUpTeamFragment } from "@aca/gql";

const clickupTeamFragment = gql`
  fragment ClickUpTeam on clickup_team {
    id
    clickup_team_id
    name
    created_at
    updated_at
  }
`;

export const clickupTeamEntity = defineEntity<ClickUpTeamFragment>({
  name: "clickup_team",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<ClickUpTeamFragment>(clickupTeamFragment),
  sync: createHasuraSyncSetupFromFragment<ClickUpTeamFragment>(clickupTeamFragment),
});

export type ClickUpTeamEntity = EntityByDefinition<typeof clickupTeamEntity>;
