import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { PopPresenceAnimator } from "@aca/ui/animations";
import { Logo } from "@aca/ui/icons/logos/AcapelaLogo";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  hideLogo?: boolean;
}

export function FocusedActionLayout({ children, title, description, hideLogo }: Props) {
  const hasTypo = !!title || !!description;
  return (
    <UIHolder>
      <UIWindow>
        <UIHead>
          {!hideLogo && <UILogo />}
          {hasTypo && (
            <UITypo>
              {title && <UITitle>{title}</UITitle>}
              {description && <UIDescription>{description}</UIDescription>}
            </UITypo>
          )}
        </UIHead>

        {children}
      </UIWindow>
    </UIHolder>
  );
}

const UIHolder = styled.div<{}>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  flex-direction: column;
  ${theme.colors.layout.background.asBgWithReadableText};
  padding: 20px;
`;

const UIWindow = styled(PopPresenceAnimator)<{}>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 700px;
  gap: 48px;

  min-width: 420px;

  ${phone(css`
    min-width: 0;
    width: 100%;
  `)}
`;

const UIHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${theme.spacing.actionsSection.asGap};
`;

const UITypo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${theme.spacing.close.asGap};
`;

const UITitle = styled.div`
  ${theme.typo.hero};
`;

const UIDescription = styled.div`
  ${theme.typo.body.medium.secondary};
  max-width: 40ch;
`;

const UILogo = styled(Logo)<{}>`
  ${theme.iconSize.hero};
`;
