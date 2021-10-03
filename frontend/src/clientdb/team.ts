import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { TeamFragment } from "~gql";

import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const teamFragment = gql`
  fragment Team on team {
    id
    name
    slug
    owner_id
    updated_at
    membershipsIds: memberships {
      user_id
    }
  }
`;

export const teamEntity = defineEntity<TeamFragment>({
  name: "team",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamFragment>(teamFragment),
  getDefaultValues() {
    return {
      __typename: "team",
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<TeamFragment>(teamFragment, {
    insertColumns: ["id", "slug", "owner_id", "name"],
    updateColumns: ["name", "slug"],
  }),
}).addConnections((team, { getEntity }) => {
  const memberIds = team.membershipsIds.map((member) => member.user_id);
  return {
    members: getEntity(userEntity).find((user) => memberIds.includes(user.id)),
  };
});
