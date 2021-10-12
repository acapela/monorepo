import React, { ReactNode } from "react";
import styled from "styled-components";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import { theme } from "~ui/theme";

import { TeamPickerView } from "../TeamPicker";
import { SidebarContent } from "./SidebarContent";

interface Props {
  children?: ReactNode;
}

export const SidebarLayout = ({ children }: Props) => {
  const user = useCurrentUserTokenData();
  const currentTeamId = useCurrentTeamId();

  if (!user) {
    return (
      <WindowView>
        <LoginOptionsView />
      </WindowView>
    );
  }

  if (!currentTeamId) {
    return (
      <WindowView>
        <TeamPickerView />
      </WindowView>
    );
  }

  return (
    <UIHolder>
      <UISidebar>
        <SidebarContent />
      </UISidebar>
      <UIMainContent>{children}</UIMainContent>
    </UIHolder>
  );
};

const UISidebar = styled.div<{}>`
  max-height: 100vh;
  height: 100vh;
  background-color: ${theme.colors.layout.background()};

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
  background-color: ${theme.colors.layout.foreground()};
`;
