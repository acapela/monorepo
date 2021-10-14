import { observer } from "mobx-react";
import { signOut } from "next-auth/client";
import React, { ReactNode, useEffect } from "react";
import styled from "styled-components";

import { useCurrentUserTokenData } from "~frontend/authentication/useCurrentUser";
import { useNullableDb } from "~frontend/clientdb";
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import { theme } from "~ui/theme";

import { TeamPickerView } from "../TeamPicker";
import { SidebarContent } from "./SidebarContent";

interface Props {
  children?: ReactNode;
}

/**
 * This hook returns a view that needs to be interacted with first, before another view can be used. Less abstractly,
 * that includes:
 * - login
 * - creating an account (users without accounts are created for invitations, and forced to log-out for now)
 * - choosing a team
 */
function useBlockingViews() {
  const userTokenData = useCurrentUserTokenData();
  const currentTeamId = useCurrentTeamId();

  const db = useNullableDb();
  const user = userTokenData && db && db.user.findById(userTokenData.id);
  const isUserWithoutAccount = user && !user.has_account;

  useEffect(() => {
    if (isUserWithoutAccount) {
      signOut();
    }
  }, [isUserWithoutAccount]);

  if (isUserWithoutAccount) {
    return <></>;
  }

  if (!userTokenData || !user) {
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

  return null;
}

export const SidebarLayout = observer(({ children }: Props) => {
  const blockingView = useBlockingViews();
  return (
    blockingView || (
      <UIHolder>
        <UISidebar>
          <SidebarContent />
        </UISidebar>
        <UIMainContent>
          <UIMainContentBody>{children}</UIMainContentBody>
        </UIMainContent>
      </UIHolder>
    )
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
  overflow-y: hidden;
`;

const UIMainContentBody = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
