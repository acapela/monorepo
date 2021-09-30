import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

const UISidebar = styled.div<{}>`
  min-height: 100vh;
  background-color: ${theme.colors.layout.background()};

  box-sizing: border-box;
  flex-shrink: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  padding-top: 20px;
`;

const UIHolder = styled.div<{}>`
  display: flex;
  min-height: 100vh;
  background: black;
`;

const UIMainContent = styled.div<{}>`
  flex-grow: 1;
  max-height: 100vh;
  background-color: ${theme.colors.layout.foreground()};
`;

interface Props {
  children?: ReactNode;
  sidebarContent?: ReactNode;
}

export const SidebarLayout = ({ children, sidebarContent }: Props) => {
  return (
    <UIHolder>
      <UISidebar>{sidebarContent}</UISidebar>
      <UIMainContent>{children}</UIMainContent>
    </UIHolder>
  );
};
