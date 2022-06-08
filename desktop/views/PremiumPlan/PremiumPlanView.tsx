import { AnimatePresence } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { getCurrentPlan, switchSubscription } from "@aca/desktop/domains/plan/api";
import { SubscriptionPlan } from "@aca/gql";
import { styledObserver } from "@aca/shared/component";
import { useDependencyChangeEffect } from "@aca/shared/hooks/useChangeEffect";

import { AwaitingCheckoutCover } from "./AwaitingCheckoutCover";
import { Plans } from "./Plans";
import { UIPricingBadge } from "./ui";

interface Props {
  onPlanChanged?: (plan: SubscriptionPlan) => void;
  className?: string;
}

export const PremiumPlanView = styledObserver(({ onPlanChanged, className }: Props) => {
  const [isWaitingForCheckout, setIsWaitingForCheckout] = useState(false);

  const currentPlan = getCurrentPlan();

  useEffect(() => {
    setIsWaitingForCheckout(false);
  }, [currentPlan]);

  useDependencyChangeEffect(() => {
    onPlanChanged?.(currentPlan);
  }, [currentPlan]);

  async function handlePlanChangeRequest(plan: SubscriptionPlan) {
    if (plan === currentPlan) return; // Should not happen
    if (plan == "PREMIUM" && !confirm("Do you really want to cancel your subscription?")) {
      return;
    }

    setIsWaitingForCheckout(true);
    await switchSubscription(plan);
  }

  return (
    <UIHolder className={className}>
      <UIHead>
        <UIPricingBadge>CHOOSE A PLAN</UIPricingBadge>
        <UIHero>Pricing</UIHero>
        <UIIntro>
          No matter if you are just getting started or already are a poweruser. We’ve got a plan for you!
        </UIIntro>
      </UIHead>

      <UIPlans>
        <Plans currentPlan={currentPlan} onPlanChangeRequest={handlePlanChangeRequest} />
      </UIPlans>
      <AnimatePresence>
        {isWaitingForCheckout && (
          <AwaitingCheckoutCover
            onCancel={() => {
              trackEvent("Upgrade Flow Cancelled");
              setIsWaitingForCheckout(false);
            }}
          />
        )}
      </AnimatePresence>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 64px;
`;

const UIHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const UIHero = styled.div`
  font-size: 44px;
  font-weight: 600;
  text-align: center;
`;
const UIIntro = styled.div`
  line-height: 1.5em;
  font-size: 16px;
  text-align: center;
  opacity: 0.5;
  max-width: 420px;
  font-weight: 400;
`;

const UIPlans = styled.div``;
