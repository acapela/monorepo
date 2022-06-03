import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { SubscriptionPlan } from "@aca/gql";
import { Button } from "@aca/ui/buttons/Button";
import { IconCheck } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { Price } from "./Price";
import { UIPricingBadge } from "./ui";

interface Props {
  currentPlan: SubscriptionPlan;
  onPlanChangeRequest: (plan: SubscriptionPlan) => void;
}

export const Plans = observer(({ currentPlan, onPlanChangeRequest }: Props) => {
  return (
    <UIHolder>
      <UIFreeCard>
        <UIHead>
          <UIPricingBadge>FREE</UIPricingBadge>
        </UIHead>
        <Price price="0€" period="MONTHLY" description="Start taking control of your notifications. Yep, it’s free." />

        <UIDelimiter />
        <UIFeaturesList>
          <UIFeature>3 Integrations</UIFeature>
          <UIFeature>2 Custom Inboxes</UIFeature>
          <UIFeature>1 Slack Workspaces</UIFeature>
        </UIFeaturesList>
        <UICTA>
          <Button isWide isDisabled>
            Already included
          </Button>
        </UICTA>
      </UIFreeCard>
      <UIProCard>
        <UIHead>
          <UIPricingBadge $kind="secondary">Premium</UIPricingBadge>
          <UIPricingBadge $kind="meta">Launch offer</UIPricingBadge>
        </UIHead>
        <Price price="0€" period="MONTHLY" description="Connect all your work tools and transform your workflow." />
        <UIDelimiter />
        <UIFeaturesList>
          <UIFeature>10 Integrations</UIFeature>
          <UIFeature>5 Custom Inboxes</UIFeature>
          <UIFeature>3 Slack Workspaces</UIFeature>
        </UIFeaturesList>
        <UICTA>
          <Button
            isWide
            isDisabled={currentPlan === "PREMIUM"}
            icon={currentPlan === "PREMIUM" ? <IconCheck /> : null}
            onClick={() => {
              onPlanChangeRequest("PREMIUM");
            }}
          >
            {currentPlan === "PREMIUM" ? "Current plan" : "Cancel subscription"}
          </Button>
        </UICTA>
      </UIProCard>
      <UIUltimateCard>
        <UIHead>
          <UIPricingBadge>Ultimate</UIPricingBadge>
        </UIHead>
        <Price price="12€" period="MONTHLY" description="Inbox Zero for every tool, without any limitations." />
        <UIDelimiter />
        <UIFeaturesList>
          <UIFeature>Unlimited Integrations</UIFeature>
          <UIFeature>Unlimited Custom Inboxes</UIFeature>
          <UIFeature>Unlimited Slack Workspaces</UIFeature>
          <UIFeature>
            <strong>Gmail & Google Suite Integration</strong>
          </UIFeature>
        </UIFeaturesList>
        <UICTA>
          <Button
            isWide
            isDisabled={currentPlan === "ULTIMATE"}
            kind="primary"
            icon={currentPlan === "ULTIMATE" ? <IconCheck /> : null}
            onClick={() => {
              onPlanChangeRequest("ULTIMATE");
            }}
          >
            {currentPlan === "ULTIMATE" ? "Current plan" : "Upgrade"}
          </Button>
        </UICTA>
      </UIUltimateCard>
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
`;

const UICardBase = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border-radius: 6px;
  border: 1px solid ${theme.colors.layout.divider.value};
  gap: 24px;

  ${theme.transitions.hover()}

  &:hover {
    ${theme.colors.layout.backgroundAccent.asBg}
  }
`;

const primaryColor = theme.colors.primary;

const UIFreeCard = styled(UICardBase)``;
const UIProCard = styled(UICardBase)``;
const UIUltimateCard = styled(UICardBase)`
  background: linear-gradient(180deg, ${primaryColor.value} 0%, ${primaryColor.opacity(0).value} 44.56%);
  border: 1px solid ${primaryColor.value};

  &:hover {
    box-shadow: 0 0 30px ${primaryColor.opacity(0.3).value};
    background-color: transparent;
  }
`;

const UIHead = styled.div`
  display: flex;
  gap: 8px;
`;

const UIDelimiter = styled.div`
  height: 1px;
  ${theme.colors.layout.divider.asBg}
`;

const UIFeaturesList = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  flex-grow: 1;
`;

const UIFeature = styled.div`
  font-weight: 500;
`;

const UICTA = styled.div``;
