import React from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

export const Panel = ({ title, children }: { title?: string; children: React.ReactNode }) => (
  <UIPanel>
    <UITitle>{title}</UITitle>
    {children}
  </UIPanel>
);

const UIPanel = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;

  ${theme.colors.layout.background.withBorder.asBg};
  ${theme.radius.primaryItem};

  width: 100%;
`;

const UITitle = styled.h3<{}>`
  ${theme.typo.secondaryTitle};
`;
