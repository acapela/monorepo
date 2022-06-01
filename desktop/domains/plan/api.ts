import gql from "graphql-tag";

import { apolloClient } from "@aca/desktop/apolloClient";
import { openAppUrl } from "@aca/desktop/bridge/apps";
import { accountStore } from "@aca/desktop/store/account";
import { SubscriptionPlan, SwitchSubscriptionPlanMutation, SwitchSubscriptionPlanMutationVariables } from "@aca/gql";

export async function switchSubscription(plan: SubscriptionPlan) {
  const { data } = await apolloClient.mutate<SwitchSubscriptionPlanMutation, SwitchSubscriptionPlanMutationVariables>({
    mutation: gql`
      mutation SwitchSubscriptionPlan($plan: SubscriptionPlan!) {
        result: switch_subscription_plan(plan: $plan) {
          checkout_url
        }
      }
    `,
    variables: { plan },
  });
  const url = data?.result.checkout_url;
  if (url) {
    await openAppUrl({ fallback: url });
  }
}

export function getCurrentPlan(): SubscriptionPlan {
  return accountStore.assertUser.subscription_plan.toUpperCase() as SubscriptionPlan;
}
