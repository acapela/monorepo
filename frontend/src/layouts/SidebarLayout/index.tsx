import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { theme } from "~ui/theme";

import { SidebarContent } from "./SidebarContent";
import { useAppRedirects } from "./useAppRedirects";

interface Props {
  children?: ReactNode;
}

export const SidebarLayout = observer(({ children }: Props) => {
  const canRender = useAppRedirects();

  if (!canRender) {
    return null;
  }

  return (
    <UIHolder>
      <UISidebar>
        <SidebarContent />
      </UISidebar>
      <UIMainContent>
        <UIMainContentBody>{children}</UIMainContentBody>
      </UIMainContent>
    </UIHolder>
  );
});

const UISidebar = styled.div<{}>`
  max-height: 100vh;
  height: 100vh;
  ${theme.colors.layout.backgroundAccent.asBg};

  box-sizing: border-box;
  flex-shrink: 0;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const UIHolder = styled.div<{}>`
  display: flex;
  min-height: 100vh;
`;

const UIMainContent = styled.div<{}>`
  flex-grow: 1;
  min-width: 0;
  max-height: 100vh;
  ${theme.colors.layout.background.asBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
`;

const UIMainContentBody = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
