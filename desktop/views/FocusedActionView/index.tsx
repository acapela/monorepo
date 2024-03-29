import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { Logo } from "@aca/desktop/ui/Logo";
import { SYSTEM_BAR_HEIGHT } from "@aca/desktop/ui/systemTopBar/ui";
import { PopPresenceAnimator } from "@aca/ui/animations";
import { phone } from "@aca/ui/responsive";
import { theme } from "@aca/ui/theme";

interface Props {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  hideLogo?: boolean;
}

export function FocusedActionView({ children, title, description, hideLogo }: Props) {
  const hasTypo = !!title || !!description;
  return (
    <UIHolder>
      <UIWindowDragger />
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
  ${theme.gradients.actionPageBg.asBg};
  padding: 20px;
`;

const UIWindow = styled(PopPresenceAnimator)<{}>`
  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.panel};
  ${theme.shadow.modal};
  ${theme.box.panel.pageCart.padding.radius};
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 700px;

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
  margin-bottom: 50px;
`;

const UITypo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  ${theme.spacing.close.asGap};
`;

const UITitle = styled.div`
  ${theme.typo.bodyTitle};
`;

const UIDescription = styled.div`
  ${theme.typo.body.medium.secondary};
  max-width: 40ch;
`;

const UILogo = styled(Logo)<{}>`
  ${theme.iconSize.section};
`;

const UIWindowDragger = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: ${SYSTEM_BAR_HEIGHT}px;
  ${theme.common.dragWindow};
  z-index: 2;
`;
