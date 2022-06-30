import { differenceInSeconds } from "date-fns";
import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { clickupTeamEntity } from "@aca/desktop/clientdb/clickupTeam";
import { DesktopUserFragment, User_Bool_Exp, User_Set_Input } from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

import { accountEntity } from "./account";
import { asanaAccountEntity } from "./asanaAccount";
import { asanaWebhookEntity } from "./asanaWebhook";
import { userSlackInstallationEntity } from "./userSlackInstallation";

const userFragment = gql`
  fragment DesktopUser on user {
    id
    name
    email
    avatar_url
    is_slack_auto_resolve_enabled
    onboarding_finished_at
    subscription_plan
    updated_at
    created_at
    referral_code
    count_referrals
  }
`;

type UserConstraints = {
  update: User_Set_Input;
  where: User_Bool_Exp;
};

export const userEntity = defineEntity<DesktopUserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<DesktopUserFragment>(userFragment),
  getDefaultValues: () => ({
    __typename: "user",
    onboarding_finished_at: null,
    avatar_url: null,
    referral_code: null,
    count_referrals: 0,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<DesktopUserFragment, UserConstraints>(userFragment, {
    updateColumns: ["is_slack_auto_resolve_enabled", "onboarding_finished_at"],
  }),
}).addView((user, { db: { entity } }) => {
  return {
    get slackInstallation() {
      return entity(userSlackInstallationEntity).findFirst({ user_id: user.id });
    },
    get accounts() {
      return entity(accountEntity).all;
    },
    get slackInstallations() {
      return entity(userSlackInstallationEntity).query({ user_id: user.id });
    },
    get asanaAccounts() {
      return entity(asanaAccountEntity).query({ user_id: user.id });
    },
    get asanaWebhooks() {
      return entity(asanaWebhookEntity).all;
    },
    get clickupTeams() {
      return entity(clickupTeamEntity).all;
    },
    get isNew() {
      const timeSinceUserCreatedInSeconds = Math.abs(differenceInSeconds(new Date(), new Date(user.created_at)));

      return timeSinceUserCreatedInSeconds < 60;
    },
    get didFinishOnboarding() {
      return !!user.onboarding_finished_at;
    },
  };
});

export type UserEntity = EntityByDefinition<typeof userEntity>;
