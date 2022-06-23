import React, { ReactNode } from "react";
import styled, { css } from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  title: string;
  description?: string;
  children?: ReactNode;
  fixedOptionWidth?: number;
  icon?: ReactNode;
}

export function SettingRow({ title, description, children, fixedOptionWidth, icon }: Props) {
  return (
    <UIHolder>
      {icon && <UIIcon>{icon}</UIIcon>}
      <UIInfo>
        <UITitle>{title}</UITitle>
        {description && <UIDescription>{description}</UIDescription>}
      </UIInfo>
      {children && <UIOption $fixedWidth={fixedOptionWidth}>{children}</UIOption>}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UIInfo = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const UIIcon = styled.div`
  ${theme.iconSize.item};
`;

const UITitle = styled.div`
  ${theme.typo.bodyTitle}
  ${theme.common.ellipsisText}
`;

const UIDescription = styled.div`
  ${theme.typo.noteTitle.secondary}
`;

const UIOption = styled.div<{ $fixedWidth?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  /* Same size of "+ Connect" button */
  min-width: 135px;

  ${(props) =>
    props.$fixedWidth &&
    css`
      width: ${props.$fixedWidth}px;
      min-width: ${props.$fixedWidth}px;
    `}
`;
