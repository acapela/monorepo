import React from "react";

import { AppLayout } from "~frontend/layouts/AppLayout";
import { routes } from "~frontend/router";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { DashboardView } from "~frontend/views/DashboardView/DashboardView";

export function DashboardPage() {
  const topicParams = routes.dashboardTopic.useParams()?.route;

  // We're on topic route
  if (topicParams) {
    const { topicId } = topicParams;
    return <DashboardView topicId={topicId} />;
  }

  return <DashboardView />;
}

assignPageLayout(DashboardPage, AppLayout, { legacyHideNavigation: true });
