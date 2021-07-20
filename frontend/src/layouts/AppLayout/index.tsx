import Link from "next/link";
import React, { ReactNode, useRef } from "react";
import styled, { css } from "styled-components";
import { SmallLogo } from "~frontend/ui/Logo";
import { UserMenu } from "./UserMenu";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TeamPickerView } from "./TeamPicker";
import { WindowView } from "~frontend/views/WindowView";
import { LoginOptionsView } from "~frontend/views/LoginOptionsView";
import { routes, useIsAnyRouteActive } from "~frontend/routes";
import { Breadcrumbs } from "./Breadcrumbs";
import { PrimaryNavigation } from "./PrimaryNavigation";
import { TopBarSearchBar } from "./Search";

interface Props {
  children?: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  const user = useCurrentUser();
  const topBarRef = useRef<HTMLDivElement | null>(null);

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
        <UITopBar ref={topBarRef} isCenteringMiddleElement={!shouldShowBreadcrumbs}>
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

          <UISearchAndUserMenu>
            <TopBarSearchBar anchorRef={topBarRef} />
            <UserMenu />
          </UISearchAndUserMenu>
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
      grid-auto-flow: column;
      grid-template-columns: minmax(200px, 1fr) 2fr minmax(200px, 1fr);
    `;
  }}

  align-items: center;
  padding: 0.75rem 1.5rem;

  background: #ffffff;
  box-shadow: 0px 1px 0px #ededed;
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
  margin-right: 2rem;

  ${SmallLogo} {
    height: 32px;
  }
`;

const UISearchAndUserMenu = styled.div`
  margin-left: 2rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 24px;
`;

const UIMainContent = styled.div`
  padding: 2rem;
  min-height: 0;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;
