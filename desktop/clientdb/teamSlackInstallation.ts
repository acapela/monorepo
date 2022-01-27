import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb/entity/entity";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { TeamSlackInstallationFragment } from "@aca/gql";

const teamSlackInstallationFragment = gql`
  fragment TeamSlackInstallation on team_slack_installation {
    id
    team_id
    scopes
    updated_at
  }
`;

export const teamSlackInstallationEntity = defineEntity<TeamSlackInstallationFragment>({
  name: "team_slack_installation",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamSlackInstallationFragment>(teamSlackInstallationFragment),
  sync: createHasuraSyncSetupFromFragment<TeamSlackInstallationFragment>(teamSlackInstallationFragment),
});

export type TeamSlackInstallationEntity = EntityByDefinition<typeof teamSlackInstallationEntity>;
