import gql from "graphql-tag";
import { observable } from "mobx";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
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

const userSlackChannelsByTeamFragment = gql`
  fragment UserSlackChannelsByTeam on user_slack_channels_by_team {
    id
    user_id
    updated_at
    created_at
    slack_workspace_id
    included_channels
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
  keyField: "id",
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "user_slack_channels_by_team",
    user_id: getContextValue(userIdContext) ?? undefined,
    included_channels: [],
    ...getGenericDefaultData(),
  }),
  customObservableAnnotations: {
    included_channels: observable.ref,
  },
  keys: getFragmentKeys<UserSlackChannelsByTeamFragment>(userSlackChannelsByTeamFragment),
  sync: createHasuraSyncSetupFromFragment<UserSlackChannelsByTeamFragment, Constraints>(
    userSlackChannelsByTeamFragment,
    {
      insertColumns: ["id", "user_id", "included_channels", "slack_workspace_id", "created_at", "updated_at"],
      updateColumns: ["included_channels", "updated_at"],
      upsertConstraint: "user_slack_channels_by_team_pkey",
    }
  ),
});

export type UserSlackChannelsByTeamEntity = EntityByDefinition<typeof userSlackChannelsByTeamEntity>;
