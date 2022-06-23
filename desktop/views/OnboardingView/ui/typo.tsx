import React from "react";
import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

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
  ${theme.typo.pageTitle};
`;
const UISecondaryHero = styled(OnboardingAnimationItem)`
  ${commonTypoStyles};
  ${theme.typo.pageSubtitle};
`;

const UIDescription = styled(OnboardingAnimationItem)`
  ${commonTypoStyles};
  ${theme.typo.body.readingLineHeight.secondary};
`;
