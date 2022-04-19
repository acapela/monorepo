import React from "react";
import styled, { css } from "styled-components";

import { OnboardingAnimationItem } from "./enterAnimations";

interface OnboardingHeroProps {
  title: string;
  description?: string;
}

export function OnboardingHero({ title, description }: OnboardingHeroProps) {
  return (
    <UIHolder>
      <UIHero>{title}</UIHero>

      {description && <UIDescription>{description}</UIDescription>}
    </UIHolder>
  );
}

export function OnboardingSecondaryHero({ title, description }: OnboardingHeroProps) {
  return (
    <UIHolder>
      <UISecondaryHero>{title}</UISecondaryHero>
      {description && <UIDescription>{description}</UIDescription>}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: min(100%, 540px);
`;

const commonTypoStyles = css`
  text-align: center;
`;

const UIHero = styled(OnboardingAnimationItem)`
  ${commonTypoStyles}
  font-size: 36px;
  font-weight: 600;
`;
const UISecondaryHero = styled(OnboardingAnimationItem)`
  ${commonTypoStyles};
  font-size: 24px;
  font-weight: 600;
`;

const UIDescription = styled(OnboardingAnimationItem)`
  ${commonTypoStyles}
  font-size: 16px;
  opacity: 0.8;
  line-height: 1.5em;
  font-weight: 400;
`;
