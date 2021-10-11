import { autorun } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect } from "react";
import styled from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { routes } from "~frontend/router";

import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  topicSlug: string;
}

/**
 * In case topic slug changes while we have it opened, replace the router so we still have it opened.
 */
function useUpdateRouterIfSlugChanges(topic: TopicEntity | null) {
  useEffect(() => {
    if (!topic) return;

    let isFirstRun = true;
    return autorun(() => {
      const slugNow = topic.slug;

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      routes.topic.replace({ topicSlug: slugNow });
    });
  }, [topic]);
}

export const RequestView = observer(({ topicSlug }: Props) => {
  const db = useDb();
  console.log({ topicSlug });
  const topic = db.topic.findByUniqueIndex("slug", topicSlug);

  useUpdateRouterIfSlugChanges(topic);

  return <UIHolder>{topic && <TopicWithMessages topic={topic} />}</UIHolder>;
});

const UIHolder = styled.div<{}>``;
