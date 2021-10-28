import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { phone } from "~frontend/../../ui/responsive";
import { Logo } from "~frontend/ui/Logo";
import { PopPresenceAnimator } from "~ui/animations";
import { theme } from "~ui/theme";

interface Props {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
}

export function FocusedActionLayout({ children, title, description }: Props) {
  const hasTypo = !!title || !!description;
  return (
    <UIHolder>
      <UIWindow>
        <UIHead>
          <UILogo />
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
  ${theme.colors.layout.background.asBg};
  ${theme.radius.panel};
  ${theme.shadow.modal};
  ${theme.box.pageCart};
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
  ${theme.spacing.horizontalActionsSection.asGap};
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
  ${theme.typo.item.title};
`;

const UIDescription = styled.div`
  ${theme.typo.content.medium.secondary};
`;

const UILogo = styled(Logo)<{}>`
  font-size: 40px;
`;
