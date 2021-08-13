import Link from "next/link";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import { useCurrentUser } from "~frontend/authentication/useCurrentUser";
import { routes, useIsAnyRouteActive } from "~frontend/router";
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
import { useCurrentTeamId } from "~frontend/team/useCurrentTeamId";
import { useResizeCallback } from "~shared/hooks/useResizeCallback";

interface Props {
  children?: ReactNode;
}

const DEFAULT_SEARCH_BAR_WIDTH_IN_PX = 208;
const TOP_BAR_TOOLS_GAP_IN_PX = 24;

export const AppLayout = ({ children }: Props): JSX.Element => {
  const user = useCurrentUser();

  const currentTeamId = useCurrentTeamId();

  const topBarToolsRef = useRef<HTMLDivElement | null>(null);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const [availableSpaceForSearchBarInPx, setAvailableSpaceForSearchBarInPx] =
    useState<number>(DEFAULT_SEARCH_BAR_WIDTH_IN_PX);

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

  if (!currentTeamId) {
    return (
      <WindowView>
        <TeamPickerView />
      </WindowView>
    );
  }

  useEffect(() => {
    determineAvailableSpaceForSearchBar();
  }, []);

  function determineAvailableSpaceForSearchBar() {
    if (!topBarToolsRef.current || !searchBarRef.current) {
      setAvailableSpaceForSearchBarInPx(DEFAULT_SEARCH_BAR_WIDTH_IN_PX);
      return;
    }

    let availableSpace = topBarToolsRef.current.clientWidth;

    const topBarTools = topBarToolsRef.current.children;
    for (const topBarTool of topBarTools) {
      if (topBarTool !== searchBarRef.current) {
        availableSpace -= topBarTool.clientWidth + TOP_BAR_TOOLS_GAP_IN_PX;
      }
    }

    setAvailableSpaceForSearchBarInPx(availableSpace);
  }

  useResizeCallback(topBarToolsRef, determineAvailableSpaceForSearchBar);

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

          <UITopbarTools ref={topBarToolsRef}>
            <TopBarSearchBar
              ref={searchBarRef}
              availableSpaceInPx={availableSpaceForSearchBarInPx}
              defaultWidthInPx={DEFAULT_SEARCH_BAR_WIDTH_IN_PX}
            />
            <NotificationsOpener />
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
  background: ${theme.colors.layout.foreground()};
  box-shadow: ${theme.shadow.topBar};
`;

const UIBreadcrumbsHolder = styled.div<{}>`
  flex: 1;
  justify-self: flex-start;
`;

const UIPrimaryNavigation = styled.div<{}>`
  align-self: center;
  justify-self: center;
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
