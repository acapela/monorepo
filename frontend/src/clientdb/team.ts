import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { TeamFragment } from "~gql";

import { teamMemberEntity } from "./teamMember";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { userIdContext } from "./utils/context";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const teamFragment = gql`
  fragment Team on team {
    id
    name
    slug
    owner_id
    updated_at
    slack_installation {
      team_id
    }
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
}).addConnections((team, { getEntity, getContextValue }) => ({
  get hasSlackInstallation() {
    return !!team.slack_installation?.team_id;
  },
  get isOwnedByCurrentUser() {
    return team.owner_id === getContextValue(userIdContext);
  },
  members: getEntity(teamMemberEntity).query({ team_id: team.id }),
}));

export type TeamEntity = EntityByDefinition<typeof teamEntity>;
