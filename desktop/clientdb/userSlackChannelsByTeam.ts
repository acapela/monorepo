import gql from "graphql-tag";
import { observable } from "mobx";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  UserSlackChannelsByTeamFragment,
  User_Slack_Channels_By_Team_Bool_Exp,
  User_Slack_Channels_By_Team_Constraint,
  User_Slack_Channels_By_Team_Insert_Input,
  User_Slack_Channels_By_Team_Set_Input,
} from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const userSlackChannelsByTeamFragment = gql`
  fragment UserSlackChannelsByTeam on user_slack_channels_by_team {
    id
    user_id
    updated_at
    created_at
    slack_workspace_id
    included_channels
    user_slack_installation_id
    are_bots_enabled
    excluded_channels
    are_all_channels_included
  }
`;

type Constraints = {
  key: User_Slack_Channels_By_Team_Constraint;
  insert: User_Slack_Channels_By_Team_Insert_Input;
  update: User_Slack_Channels_By_Team_Set_Input;
  where: User_Slack_Channels_By_Team_Bool_Exp;
};

export const userSlackChannelsByTeamEntity = defineEntity<UserSlackChannelsByTeamFragment>({
  name: "user_slack_channels_by_team",
  updatedAtField: "updated_at",
  idField: "id",
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "user_slack_channels_by_team",
    user_id: getContextValue(userIdContext) ?? undefined,
    included_channels: [],
    are_bots_enabled: true,
    are_all_channels_included: true,
    excluded_channels: [],
    ...getGenericDefaultData(),
  }),
  customObservableAnnotations: {
    included_channels: observable.ref,
  },
  keys: getFragmentKeys<UserSlackChannelsByTeamFragment>(userSlackChannelsByTeamFragment),
  sync: createHasuraSyncSetupFromFragment<UserSlackChannelsByTeamFragment, Constraints>(
    userSlackChannelsByTeamFragment,
    {
      insertColumns: [
        "id",
        "user_id",
        "included_channels",
        "slack_workspace_id",
        "created_at",
        "updated_at",
        "user_slack_installation_id",
        "are_bots_enabled",
        "are_all_channels_included",
        "excluded_channels",
      ],
      updateColumns: [
        "included_channels",
        "updated_at",
        "are_bots_enabled",
        "are_all_channels_included",
        "excluded_channels",
      ],
      upsertConstraint: "user_slack_channels_by_team_pkey",
    }
  ),
});

export type UserSlackChannelsByTeamEntity = EntityByDefinition<typeof userSlackChannelsByTeamEntity>;
