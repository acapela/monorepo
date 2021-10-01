import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  PushUpdateTeamMutation,
  PushUpdateTeamMutationVariables,
  TeamFragment,
  Team_Insert_Input,
  Team_Set_Input,
  UpdatedTeamsQuery,
  UpdatedTeamsQueryVariables,
} from "~gql";

import { userEntity } from "./user";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

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

const [, { subscribe: subscribeToSpaceUpdates }] = createQuery<UpdatedTeamsQuery, UpdatedTeamsQueryVariables>(
  () => gql`
    ${teamFragment}

    query UpdatedTeams($lastSyncDate: timestamptz) {
      team(where: { updated_at: { _gt: $lastSyncDate } }) {
        ...Team
      }
    }
  `
);

const [, { mutate: updateTeam }] = createMutation<PushUpdateTeamMutation, PushUpdateTeamMutationVariables>(
  () => gql`
    ${teamFragment}
    mutation PushUpdateTeam($input: team_insert_input!) {
      insert_team_one(object: $input, on_conflict: { constraint: team_id_key, update_columns: [name, slug] }) {
        ...Team
      }
    }
  `
);

function convertChangedDataToInput({ name, slug, owner_id, id }: Partial<TeamFragment>): Team_Insert_Input {
  return { name, slug, owner_id, id };
}

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
  sync: {
    pull({ lastSyncDate, updateItems }) {
      return subscribeToSpaceUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.team);
      });
    },
    async push(task) {
      const result = await updateTeam({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((team, { getEntity }) => {
  const memberIds = team.membershipsIds.map((member) => member.user_id);
  return {
    get members() {
      return getEntity(userEntity).query((user) => memberIds.includes(user.id));
    },
  };
});
