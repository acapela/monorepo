import React from "react";
import { routes, useIsAnyRouteActive } from "~frontend/routes";
import { ContentBreadcrumbs } from "./Breadcrumbs";
import { PrimaryNavigation } from "./PrimaryNavigation";

export const TopBarMenu = () => {
  const shouldShowCollaborationBreadcrumbs = useIsAnyRouteActive([
    routes.space.path,
    routes.spaceRoom.path,
    routes.spaceRoomTopic.path,
    routes.spaceRoomSummary.path,
  ]);

  if (shouldShowCollaborationBreadcrumbs) {
    return <ContentBreadcrumbs />;
  }

  return <PrimaryNavigation />;
};
