import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { IconSelection } from "~ui/icons";
import { theme } from "~ui/theme";

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  noSpacing?: boolean;
}

export function EmptyStatePlaceholder({ title, description, noSpacing = false, icon = <IconSelection /> }: Props) {
  return (
    <UIHolder noSpacing={noSpacing}>
      {icon && <UIIcon>{icon}</UIIcon>}
      {title && <UITitle>{title}</UITitle>}
      {description && <UIBody>{description}</UIBody>}
    </UIHolder>
  );
}

const UIIcon = styled.div<{}>`
  font-size: 32px;
  margin-bottom: 16px;
  opacity: 0.4;
`;

const UIHolder = styled.div<{ noSpacing: boolean }>`
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  ${(props) => {
    if (props.noSpacing) return;

    return css`
      padding: 16px;
      background-color: ${theme.colors.layout.background()};
      border: 1px solid ${theme.colors.layout.softLine()};
      ${theme.borderRadius.card}
    `;
  }}
`;

const UITitle = styled.div<{}>`
  ${theme.font.h3.build}
  opacity: 0.8;
`;

const UIBody = styled.div<{}>`
  ${theme.font.body.spezia.build}
  opacity: 0.8;
`;
