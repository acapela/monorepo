import React, { ReactNode } from "react";
import styled from "styled-components";

import { CategoryNameLabel } from "~ui/theme/functional";

interface Props {
  title: string;
  children: ReactNode;
}

export const ToDoSection = ({ title, children }: Props) => {
  return (
    <UISection>
      <CategoryNameLabel>{title}</CategoryNameLabel>
      {children}
    </UISection>
  );
};

const UISection = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
