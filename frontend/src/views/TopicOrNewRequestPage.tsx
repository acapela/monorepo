import { observer } from "mobx-react";
import React from "react";

import { useDb } from "@aca/frontend/clientdb";
import { useRouteParamsIfRouteActive } from "@aca/frontend/hooks/useRouteParams";
import { SidebarLayout } from "@aca/frontend/layouts/SidebarLayout";
import { assignPageLayout } from "@aca/frontend/utils/pageLayout";
import { NewRequestView } from "@aca/frontend/views/NewRequestView";
import { RequestView } from "@aca/frontend/views/RequestView";
import { routes } from "@aca/shared/routes";

export const TopicOrNewRequestPage = observer(function TopicOrNewRequestPage(): JSX.Element {
  const duplicateRouteParams = useRouteParamsIfRouteActive(routes.topicDuplicate);
  const topicByHandleParams = useRouteParamsIfRouteActive(routes.topicByHandle);

  const db = useDb();

  if (topicByHandleParams?.topicId) {
    const topic = db.topic.findById(topicByHandleParams.topicId);

    return <RequestView topic={topic} />;
  }

  const topicToDuplicateId = duplicateRouteParams?.topicId;
  const topicToDuplicate = topicToDuplicateId ? db.topic.findById(topicToDuplicateId) : null;
  return <NewRequestView _legacyHideIfCreatingInModal topicToDuplicate={topicToDuplicate ?? undefined} />;
});

assignPageLayout(TopicOrNewRequestPage, SidebarLayout);
