import React from "react";

import { NewRequestView } from "~frontend/views/NewRequestView";
import { RequestView } from "~frontend/views/RequestView";

import { routes } from "../router";

export default function RequestPage(): JSX.Element {
  const topicParams = routes.topic.useParams()?.route;

  const topicId = topicParams?.topicId;
  if (!topicId) {
    return <NewRequestView />;
  }

  return (
    <>
      <RequestView topicId={topicId} />
    </>
  );
}
