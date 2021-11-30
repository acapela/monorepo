import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { TeamSlackInstallationFragment } from "~gql";

import { getFragmentKeys } from "./utils/analyzeFragment";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

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
  sync: createHasuraSyncSetupFromFragment<TeamSlackInstallationFragment>(teamSlackInstallationFragment, {
    insertColumns: [],
    updateColumns: [],
  }),
});

export type TeamSlackInstallationEntity = EntityByDefinition<typeof teamSlackInstallationEntity>;
