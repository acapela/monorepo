import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb/entity/entity";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { teamIdContext, userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { TeamFragment, Team_Bool_Exp, Team_Constraint, Team_Insert_Input, Team_Set_Input } from "@aca/gql";

import { teamMemberEntity } from "./teamMember";
import { teamSlackInstallationEntity } from "./teamSlackInstallation";

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

type TeamConstraints = {
  key: Team_Constraint;
  insert: Team_Insert_Input;
  update: Team_Set_Input;
  where: Team_Bool_Exp;
};

export const teamEntity = defineEntity<TeamFragment>({
  name: "team",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamFragment>(teamFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "team",
    owner_id: getContextValue(userIdContext) ?? undefined,
    slack_installation: undefined,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamFragment, TeamConstraints>(teamFragment, {
    insertColumns: ["id", "slug", "name"],
    updateColumns: ["name"],
    upsertConstraint: "team_id_key",
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
    memberships: getEntity(teamMemberEntity).query((membership) => {
      if (membership.team_id !== team.id) return false;

      // if (membership.user?.is_bot) return false;

      return true;
    }),
  };
});

export type TeamEntity = EntityByDefinition<typeof teamEntity>;
