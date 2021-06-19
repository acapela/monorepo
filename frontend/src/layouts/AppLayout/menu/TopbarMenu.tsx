import React from "react";
import styled from "styled-components";
import { routes, useIsAnyRouteActive } from "~frontend/routes";
import { IconHome, IconSpaces, IconCalendar } from "~ui/icons";
import { ContentBreadcrumbs } from "./Breadcrumbs";
import { NavItem } from "./NavItem";

export const TopBarMenu = () => {
  const shouldShowCollaborationBreadcrumbs = useIsAnyRouteActive([
    routes.space.path,
    routes.spaceRoom.path,
    routes.spaceRoomTopic.path,
    routes.spaceRoomSummary.path,
  ]);

  if (!shouldShowCollaborationBreadcrumbs) {
    return (
      <UINav>
        <NavItem item={{ key: "home", icon: <IconHome />, title: "Home", href: "/" }} />
        <NavItem item={{ key: "spaces", icon: <IconSpaces />, title: "Spaces", href: "/spaces" }} />
        <NavItem item={{ key: "calendar", icon: <IconCalendar />, title: "Calendar", href: "/calendar" }} />
      </UINav>
    );
  }

  return <ContentBreadcrumbs />;
};

const UINav = styled.nav`
  display: flex;

  ${NavItem} {
    margin: 0 0.2em;
  }
`;
