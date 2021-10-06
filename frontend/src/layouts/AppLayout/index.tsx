import Link from "next/link";
import React, { ReactNode, useRef } from "react";
import styled from "styled-components";

import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { SmallLogo } from "~frontend/ui/Logo";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import { theme } from "~ui/theme";

import { TeamPickerView } from "./TeamPicker";
import { UserMenu } from "./UserMenu";

interface Props {
  children?: ReactNode;
}

const TOP_BAR_TOOLS_GAP_IN_PX = 24;

export const AppLayout = ({ children }: Props): JSX.Element => {
  const user = useCurrentUser();

  const currentTeamId = useCurrentTeamId();

  const topBarToolsRef = useRef<HTMLDivElement | null>(null);

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
    <>
      <UIHolder>
        <UITopBar isCenteringMiddleElement={true}>
          <Link href="/" passHref>
            <UILogo>
              <SmallLogo />
            </UILogo>
          </Link>

          <UITopbarTools ref={topBarToolsRef}>
            <UserMenu />
          </UITopbarTools>
        </UITopBar>
        <UIMainContent>{children}</UIMainContent>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.div<{}>`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const UITopBar = styled.div<{ isCenteringMiddleElement: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background: ${theme.colors.layout.foreground()};
  box-shadow: ${theme.shadow.topBar};
`;

const UILogo = styled.a<{}>`
  display: block;
  font-size: 1.5rem;
  margin-right: 32px;

  ${SmallLogo} {
    height: 32px;
  }
`;

const UITopbarTools = styled.div<{}>`
  margin-left: 32px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  gap: ${TOP_BAR_TOOLS_GAP_IN_PX}px;
`;

const UIMainContent = styled.div<{}>`
  padding-bottom: 0;
  min-height: 0;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.layout.background()};
`;
