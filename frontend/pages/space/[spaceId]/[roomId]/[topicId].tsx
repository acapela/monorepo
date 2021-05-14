import React from "react";
import { withServerSideAuthRedirect } from "~frontend/authentication/withServerSideAuthRedirect";
import { AppLayout } from "~frontend/layouts/AppLayout";
import { usePathParameter } from "~frontend/utils";
import { assignPageLayout } from "~frontend/utils/pageLayout";
import { TopicView } from "~frontend/views/topic/TopicView";
import { assert } from "~shared/assert";

const Page = () => {
  const topicId = usePathParameter("topicId");

  assert(topicId, "Topic ID Required");

  return <TopicView id={topicId} />;
};

export const getServerSideProps = withServerSideAuthRedirect();

assignPageLayout(Page, AppLayout);

export default Page;
