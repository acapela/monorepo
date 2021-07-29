import Link from "next/link";
import React, { ReactNode } from "react";
import styled, { css } from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { routes, useIsAnyRouteActive } from "~frontend/routes";
import { SmallLogo } from "~frontend/ui/Logo";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { WindowView } from "~frontend/views/WindowView";
import { Breadcrumbs } from "./Breadcrumbs";
import { PrimaryNavigation } from "./PrimaryNavigation";
import { TopBarSearchBar } from "./Search";
import { TeamPickerView } from "./TeamPicker";
import { UserMenu } from "./UserMenu";
import { theme } from "~ui/theme";
import { NotificationsOpener } from "./NotificationsOpener";

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props): JSX.Element => {
  const user = useCurrentUser();

  const shouldShowBreadcrumbs = useIsAnyRouteActive([
    routes.space.path,
    routes.spaceRoom.path,
    routes.spaceRoomTopic.path,
    routes.spaceRoomSummary.path,
  ]);

  if (!user) {
    return (
      <WindowView>
        <LoginOptionsView />
      </WindowView>
    );
  }

  if (!user.currentTeamId) {
    return (
      <WindowView>
        <TeamPickerView />
      </WindowView>
    );
  }

  return (
    <>
      <UIHolder>
        <UITopBar isCenteringMiddleElement={!shouldShowBreadcrumbs}>
          <Link href="/" passHref>
            <UILogo>
              <SmallLogo />
            </UILogo>
          </Link>
          {shouldShowBreadcrumbs && (
            <UIBreadcrumbsHolder>
              <Breadcrumbs />
            </UIBreadcrumbsHolder>
          )}
          {!shouldShowBreadcrumbs && (
            <UIPrimaryNavigation>
              <PrimaryNavigation />
            </UIPrimaryNavigation>
          )}

          <UITopbarTools>
            <TopBarSearchBar />
            <NotificationsOpener />
            <UserMenu />
          </UITopbarTools>
        </UITopBar>
        <UIMainContent>{children}</UIMainContent>
      </UIHolder>
    </>
  );
};

const UIHolder = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const UITopBar = styled.div<{ isCenteringMiddleElement: boolean }>`
  ${(props) => {
    if (!props.isCenteringMiddleElement) {
      return css`
        display: flex;
        justify-content: space-around;
      `;
    }
    return css`
      display: grid;
      grid-template-columns: minmax(200px, 1fr) 2fr minmax(200px, 1fr);
    `;
  }}

  align-items: center;
  padding: 12px 24px;
  background: ${theme.colors.layout.foreground};
  box-shadow: ${theme.shadow.topBar};
`;

const UIBreadcrumbsHolder = styled.div`
  flex: 1;
  justify-self: flex-start;
`;

const UIPrimaryNavigation = styled.div`
  align-self: center;
  justify-self: center;
`;

const UILogo = styled.a`
  display: block;
  font-size: 1.5rem;
  margin-right: 32px;

  ${SmallLogo} {
    height: 32px;
  }
`;

const UITopbarTools = styled.div`
  margin-left: 32px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;

  gap: 24px;
`;

const UIMainContent = styled.div`
  padding-bottom: 0;
  min-height: 0;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.layout.background};
`;
