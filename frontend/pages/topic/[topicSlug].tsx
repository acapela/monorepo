import React from "react";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { routes } from "~frontend/router";
import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";

export default function RequestPage(): JSX.Element {
  const topicParams = routes.topic.useParams()?.route;

  const topicSlug = topicParams?.topicSlug;

  if (!topicSlug) {
    return (
      <SidebarLayout>
        <NewRequestView />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <RequestView topicSlug={topicSlug} />
    </SidebarLayout>
  );
}
