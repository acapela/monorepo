import { differenceInSeconds } from "date-fns";
import gql from "graphql-tag";
import { observable } from "mobx";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { DesktopUserFragment, User_Bool_Exp, User_Set_Input } from "@aca/gql";

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
    slack_included_channels
    subscription_plan
    updated_at
    created_at
  }
`;

type UserConstraints = {
  update: User_Set_Input;
  where: User_Bool_Exp;
};

export const userEntity = defineEntity<DesktopUserFragment>({
  name: "user",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<DesktopUserFragment>(userFragment),
  getDefaultValues: () => ({
    __typename: "user",
    has_slack_installation: null,
    onboarding_finished_at: null,
    avatar_url: null,
    slack_included_channels: [],
    ...getGenericDefaultData(),
  }),
  customObservableAnnotations: {
    slack_included_channels: observable.ref,
  },
  sync: createHasuraSyncSetupFromFragment<DesktopUserFragment, UserConstraints>(userFragment, {
    updateColumns: ["is_slack_auto_resolve_enabled", "slack_included_channels", "onboarding_finished_at"],
  }),
}).addConnections((user, { getEntity }) => {
  return {
    get slackInstallation() {
      return getEntity(userSlackInstallationEntity).query({ user_id: user.id }).first ?? null;
    },
    get accounts() {
      return getEntity(accountEntity).all;
    },
    get slackInstallations() {
      return getEntity(userSlackInstallationEntity).query({ user_id: user.id });
    },
    get asanaAccounts() {
      return getEntity(asanaAccountEntity).query({ user_id: user.id });
    },
    get asanaWebhooks() {
      return getEntity(asanaWebhookEntity).all;
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
