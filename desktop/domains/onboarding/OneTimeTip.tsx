import React, { ReactNode } from "react";
import styled from "styled-components";

import { styledObserver } from "@aca/shared/component";
import { Button } from "@aca/ui/buttons/Button";
import { IconInfo } from "@aca/ui/icons";
import { theme } from "@aca/ui/theme";

import { getWasOnboardingTipSeen, markOnboardingTipAsSeen } from "./store";

interface Props {
  id: string;
  children: ReactNode;
  className?: string;
}

export const OneTimeTip = styledObserver(function OneTimeTip({ id, children, className }: Props) {
  const wasSeen = getWasOnboardingTipSeen(id);

  if (wasSeen) return null;

  return (
    <UIHolder className={className}>
      <UIIcon>
        <IconInfo />
      </UIIcon>
      <UIContent>{children}</UIContent>
      <Button
        kind="primarySubtle"
        onClick={() => {
          markOnboardingTipAsSeen(id);
        }}
      >
        Got it
      </Button>
    </UIHolder>
  );
})``;

const UIHolder = styled.div`
  display: flex;
  gap: 16px;
  ${theme.colors.layout.backgroundAccent.withBorder.asBgWithReadableText}
  justify-content: space-between;
  ${theme.box.panel.hint.padding.radius};
  max-width: 60ch;
`;

const UIIcon = styled.div`
  font-size: 24px;
`;

const UIContent = styled.div`
  line-height: 1.5em;
`;
