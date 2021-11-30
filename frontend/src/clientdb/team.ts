import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { TeamFragment } from "~gql";

import { teamMemberEntity } from "./teamMember";
import { teamSlackInstallationEntity } from "./teamSlackInstallation";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { teamIdContext, userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const teamFragment = gql`
  fragment Team on team {
    id
    name
    slug
    owner_id
    updated_at
    created_at
  }
`;

export const teamEntity = defineEntity<TeamFragment>({
  name: "team",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamFragment>(teamFragment),
  getDefaultValues({ getContextValue }) {
    return {
      __typename: "team",
      owner_id: getContextValue(userIdContext) ?? undefined,
      slack_installation: undefined,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<TeamFragment>(teamFragment, {
    insertColumns: ["id", "slug", "name"],
    updateColumns: [],
  }),
}).addConnections((team, { getEntity, getContextValue }) => {
  const slackInstallations = getEntity(teamSlackInstallationEntity).query({ team_id: team.id });
  return {
    get slackInstallation() {
      return slackInstallations.first;
    },
    get hasSlackInstallation() {
      return slackInstallations.hasItems;
    },
    get isOwnedByCurrentUser() {
      return team.owner_id === getContextValue(userIdContext);
    },
    get isCurrentUserCurrentTeam() {
      return team.id === getContextValue(teamIdContext);
    },
    members: getEntity(teamMemberEntity).query({ team_id: team.id }),
  };
});

export type TeamEntity = EntityByDefinition<typeof teamEntity>;
