import gql from "graphql-tag";
import { observer } from "mobx-react";
import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";

import { apolloClient } from "@aca/desktop/apolloClient";
import { integrationLogos } from "@aca/desktop/assets/integrations/logos";
import { openAppUrl } from "@aca/desktop/bridge/apps";
import { accountStore } from "@aca/desktop/store/account";
import { SubscriptionPlan, SwitchSubscriptionPlanMutation, SwitchSubscriptionPlanMutationVariables } from "@aca/gql";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";
import { Button } from "@aca/ui/buttons/Button";
import { Logo } from "@aca/ui/icons/logos/AcapelaLogo";
import { theme } from "@aca/ui/theme";

import { Cross } from "./icons";

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

export const SubscriptionView = observer(() => {
  const [isLoading, setIsLoading] = useState(false);

  const user = accountStore.assertUser;
  const plan = user.subscription_plan;
  const isBusiness = plan == "business";

  const switchSubscriptionAndDisableButton = useCallback(async (plan: SubscriptionPlan) => {
    if (
      plan == "PREMIUM" &&
      !confirm("Do you really want to cancel your subscription? You will lose the ability to connect Gmail.")
    ) {
      return;
    }

    setIsLoading(true);
    await switchSubscription(plan);
    setIsLoading(false);
  }, []);

  // We assume the checkout has loaded when the plan has changed
  useDependencyChangeEffect(() => {
    setIsLoading(false);
  }, [plan]);

  return isBusiness ? (
    <UIHolder>
      <div>
        You are currently on the <strong>{plan}</strong> subscription plan.
      </div>

      <Button
        kind="secondary"
        isDisabled={isLoading}
        onClick={() => {
          switchSubscriptionAndDisableButton("PREMIUM");
        }}
      >
        Cancel your subscription immediately
      </Button>
    </UIHolder>
  ) : (
    <UIHolder>
      <UIIcons>
        <UILogo />
        <Cross />
        <UIGoogleImg src={integrationLogos.googleSuite} alt="Google Suite" />
      </UIIcons>

      <UITitle>Acapela Ultimate</UITitle>

      <UIDescription>
        Integrate your complete Google Suite into Acapela with our premium subscription plan.
      </UIDescription>

      <UIPriceText>10€</UIPriceText>

      <UIInfoText>Paid monthly</UIInfoText>

      <Button
        kind="primary"
        isDisabled={isLoading}
        onClick={() => {
          switchSubscriptionAndDisableButton("BUSINESS");
        }}
        style={{ minWidth: 280 }}
      >
        Upgrade now!
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  max-width: 560px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const UIIcons = styled.div`
  margin-bottom: 50px;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 25px;
`;

const UITitle = styled.div`
  margin-bottom: 10px;

  font-size: 36px;
  ${theme.font.bold};
`;

const UIDescription = styled.div`
  margin-bottom: 25px;

  font-size: 16px;
  ${theme.font.secondary};
`;

const UIPriceText = styled.div`
  font-size: 36px;
  ${theme.font.bold};
`;

const UIInfoText = styled.div`
  margin-bottom: 25px;

  font-size: 14px;
  ${theme.font.secondary};
`;

const logoSizeStyle = css`
  width: 64px;
  height: 64px;
`;

const UILogo = styled(Logo)`
  ${logoSizeStyle};
`;

const UIGoogleImg = styled.img`
  ${logoSizeStyle};
`;
