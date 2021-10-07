import React from "react";

import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";

import { routes } from "../router";

export default function RequestPage(): JSX.Element {
  const topicParams = routes.topic.useParams()?.route;

  const topicId = topicParams?.topicId;
  if (!topicId) {
    return (
      <SidebarLayout>
        <NewRequestView />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout selectedTopicId={topicId}>
      <RequestView topicId={topicId} />
    </SidebarLayout>
  );
}
