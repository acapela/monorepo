import { observer } from "mobx-react";
import React, { ReactNode } from "react";
import styled from "styled-components";

import { avoidTitleBarPadding } from "@aca/desktop/styles/titleBar";
import { theme } from "@aca/ui/theme";

import { SidebarContent } from "./content";

interface Props {
  children?: ReactNode;
}

export const SidebarLayout = observer(({ children }: Props) => {
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
  height: 100vh;
  max-height: 100vh;
  ${theme.colors.layout.backgroundAccent.asBg};
  ${avoidTitleBarPadding}

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
  transition: 0.2s all;
`;

const UIMainContentBody = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;
