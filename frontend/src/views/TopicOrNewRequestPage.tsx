import React from "react";

import { useRouteParams } from "~frontend/hooks/useRouteParams";
import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";
import { routes } from "~shared/routes";

export function TopicOrNewRequestPage(): JSX.Element {
  const { topicSlug } = useRouteParams(routes.topic);

  if (!topicSlug) {
    return (
      <SidebarLayout>
        <NewRequestView />{" "}
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <RequestView topicSlug={topicSlug} />
    </SidebarLayout>
  );
}
