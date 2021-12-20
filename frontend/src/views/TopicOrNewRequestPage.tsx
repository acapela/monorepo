import { observer } from "mobx-react";
import React from "react";

import { useDb } from "~frontend/clientdb";
import { useRouteParamsIfRouteActive } from "~frontend/hooks/useRouteParams";
import { SidebarLayout } from "~frontend/layouts/SidebarLayout";
import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";
import { routes } from "~shared/routes";

export const TopicOrNewRequestPage = observer(function TopicOrNewRequestPage(): JSX.Element {
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

  const topicToDuplicateId = duplicateRouteParams?.topicId;
  const topicToDuplicate = topicToDuplicateId ? db.topic.findById(topicToDuplicateId) : null;
  return (
    <SidebarLayout>
      <NewRequestView _legacyHideIfCreatingInModal topicToDuplicate={topicToDuplicate ?? undefined} />
    </SidebarLayout>
  );
});
