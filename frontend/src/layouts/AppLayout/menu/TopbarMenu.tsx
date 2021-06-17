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
  ]);

  if (!shouldShowCollaborationBreadcrumbs) {
    return (
      <UINav>
        <NavItem icon={<IconHome />} label="Home" href="/" />
        <NavItem icon={<IconSpaces />} label="Spaces" href="/spaces" />
        <NavItem icon={<IconCalendar />} label="Calendar" href="/calendar" />
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
