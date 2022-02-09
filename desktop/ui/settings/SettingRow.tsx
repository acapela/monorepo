import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "@aca/ui/theme";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SettingRow({ title, description, children }: Props) {
  return (
    <UIHolder>
      <UIInfo>
        <UITitle>{title}</UITitle>
        {description && <UIDescription>{description}</UIDescription>}
      </UIInfo>
      <UIOption>{children}</UIOption>
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 16px;
`;

const UIInfo = styled.div`
  flex-grow: 1;
  min-width: 0;
`;

const UITitle = styled.div`
  ${theme.typo.item.title}
`;

const UIDescription = styled.div`
  ${theme.typo.item.description}
`;

const UIOption = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  /* Same size of "+ Connect" button */
  min-width: 135px;
`;
