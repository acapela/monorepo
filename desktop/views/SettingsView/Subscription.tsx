import gql from "graphql-tag";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { apolloClient } from "@aca/desktop/apolloClient";
import { openAppUrl } from "@aca/desktop/bridge/apps";
import { accountStore } from "@aca/desktop/store/account";
import { SubscriptionPlan, SwitchSubscriptionPlanMutation, SwitchSubscriptionPlanMutationVariables } from "@aca/gql";
import { Button } from "@aca/ui/buttons/Button";

export async function switchSubscription(plan: SubscriptionPlan) {
  if (
    plan == "PREMIUM" &&
    !confirm("Do you really want to cancel your subscription? You will lose the ability to connect Gmail.")
  ) {
    return;
  }

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

export const SubscriptionView = observer(() => {
  const user = accountStore.assertUser;
  const plan = user.subscription_plan;
  const isBusiness = plan == "business";

  return (
    <UIHolder>
      <div>
        You are currently on the <strong>{plan}</strong> subscription plan
        {plan == "premium" ? ", free for beta users." : "."}
      </div>

      <Button
        kind={isBusiness ? "secondary" : "primarySubtle"}
        onClick={() => switchSubscription(isBusiness ? "PREMIUM" : "BUSINESS")}
      >
        {isBusiness ? "Cancel your subscription immediately" : "Upgrade to our business plan to unlock all features"}
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  strong {
    font-weight: 600;
  }
`;
