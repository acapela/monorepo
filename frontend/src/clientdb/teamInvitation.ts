import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { userEntity } from "~frontend/clientdb/user";
import { getFragmentKeys } from "~frontend/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "~frontend/clientdb/utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "~frontend/clientdb/utils/sync";
import { TeamInvitationFragment } from "~gql";

const teamInvitationFragment = gql`
  fragment TeamInvitation on team_invitation {
    id
    team_id
    email
    slack_user_id
    used_by_user_id
    updated_at
  }
`;

export const teamInvitationEntity = defineEntity<TeamInvitationFragment>({
  name: "team_invitation",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<TeamInvitationFragment>(teamInvitationFragment),
  getDefaultValues: () => ({
    __typename: "team_invitation",
    slack_user_id: null,
    used_by_user_id: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<TeamInvitationFragment>(teamInvitationFragment, {
    insertColumns: ["id", "team_id", "email"],
    updateColumns: [],
  }),
}).addConnections((teamInvitation, { getEntity }) => ({
  usedByUser: teamInvitation.used_by_user_id ? getEntity(userEntity).findById(teamInvitation.used_by_user_id) : null,
}));
