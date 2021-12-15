import { observer } from "mobx-react";
import router from "next/router";

import { useDb } from "~frontend/clientdb";
import { useRouteParamsIfRouteActive } from "~frontend/hooks/useRouteParams";
import { routes } from "~shared/routes";

function Page(): JSX.Element {
  const topicRouteParams = useRouteParamsIfRouteActive(routes._deprecated_topic);
  const topicSlug = topicRouteParams?.topicSlug;
  const db = useDb();
  const topic = db.topic.findByUniqueIndex("slug", topicSlug);
  const topicId = topic?.id;
  const teamName = topic?.team?.name;
  if (!topicSlug || !teamName || !topicId) {
    router.push("/404");
  } else {
    router.push(`/${teamName}/${topicSlug}/${topicId}`);
  }
  return <div></div>;
}

export default observer(Page);
