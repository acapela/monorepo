import { observer } from "mobx-react";
import React from "react";

import { useDb } from "~frontend/clientdb";
import { useRouteParamsIfRouteActive } from "~frontend/hooks/useRouteParams";
import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";
import { routes } from "~shared/routes";

export const TopicOrNewRequestPage = observer(function TopicOrNewRequestPage(): JSX.Element {
  const topicRouteParams = useRouteParamsIfRouteActive(routes._deprecated_topic);
  const duplicateRouteParams = useRouteParamsIfRouteActive(routes.topicDuplicate);
  const topicByHandleParams = useRouteParamsIfRouteActive(routes.topicByHandle);

  const db = useDb();

  if (topicByHandleParams?.topicId) {
    const topic = db.topic.findById(topicByHandleParams.topicId);

    return (
      <SidebarLayout>
        <RequestView topic={topic} />
      </SidebarLayout>
    );
  }

  const topicSlug = topicRouteParams?.topicSlug;
  const topicToDuplicateSlug = duplicateRouteParams?.topicSlug;

  if (!topicSlug) {
    const topicToDuplicate = topicToDuplicateSlug ? db.topic.findByUniqueIndex("slug", topicToDuplicateSlug) : null;
    return (
      <SidebarLayout>
        <NewRequestView topicToDuplicate={topicToDuplicate ?? undefined} />
      </SidebarLayout>
    );
  }

  const topic = db.topic.findByUniqueIndex("slug", topicSlug);

  return (
    <SidebarLayout>
      <RequestView topic={topic} />
    </SidebarLayout>
  );
});
