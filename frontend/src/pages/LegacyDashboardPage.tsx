import React from "react";

import { AppLayout } from "~frontend/layouts/AppLayout";
import { routes } from "~frontend/router";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { LegacyDashboardView } from "~frontend/views/LegacyDashboardView/LegacyDashboardView";

export function LegacyDashboardPage() {
  const topicParams = routes.dashboardTopic.useParams()?.route;

  // We're on topic route
  if (topicParams) {
    const { topicId } = topicParams;
    return <LegacyDashboardView topicId={topicId} />;
  }

  return <LegacyDashboardView />;
}

assignPageLayout(LegacyDashboardPage, AppLayout);
