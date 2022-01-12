import { ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  noSpacing?: boolean;
  className?: string;
}

export function EmptyStatePlaceholder({ title, description, noSpacing = false, icon, className }: Props) {
  return (
    <UIHolder noSpacing={noSpacing} className={className}>
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
      ${theme.colors.layout.background.withBorder.asBg};
      ${theme.radius.primaryItem}
    `;
  }}
`;

const UITitle = styled.div<{}>`
  ${theme.typo.secondaryTitle}
`;

const UIBody = styled.div<{}>`
  ${theme.font.spezia}
  opacity: 0.8;
`;
