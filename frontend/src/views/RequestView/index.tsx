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
  const topic = db.topic.findByUniqueIndex("slug", topicSlug);

  useUpdateRouterIfSlugChanges(topic);

  if (!topic) {
    return null;
  }

  return (
    <UIHolder>
      <TopicWithMessages topic={topic} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;
