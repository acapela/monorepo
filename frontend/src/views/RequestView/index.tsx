import { autorun } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { TopicEntity } from "~frontend/clientdb/topic";
import { PageMeta } from "~frontend/utils/PageMeta";
import { routes } from "~shared/routes";
import { phone } from "~ui/responsive";

import { NotFound } from "./NotFound";
import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  topicSlug: string;
}

/**
 * In case topic slug changes while we have it opened, replace the router so we still have it opened.
 */
function useUpdateRouterIfSlugChanges(topic: TopicEntity | null) {
  const router = useRouter();
  useEffect(() => {
    if (!topic) return;

    let isFirstRun = true;
    return autorun(() => {
      const slugNow = topic.slug;

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      router.replace(routes.topic({ topicSlug: slugNow }));
    });
  }, [router, topic]);
}

function useUpdateTopicLastSeenMessage(topic: TopicEntity | null) {
  const db = useDb();
  useEffect(() => {
    if (!topic) return;

    // On load update seen at
    // Then each time new 'last' message is changed - update it again.
    return autorun(() => {
      const lastSeenMessageInfo = topic.lastSeenMessageByCurrentUserInfo;
      const lastMessage = topic.messages.last;

      const nowISO = new Date().toISOString();

      if (lastSeenMessageInfo) {
        lastSeenMessageInfo.update({ seen_at: nowISO, message_id: lastMessage?.id });

        return;
      }

      db.lastSeenMessage.create({ topic_id: topic.id, message_id: lastMessage?.id, seen_at: nowISO });
    });
  }, [topic, db]);
}

export const RequestView = observer(({ topicSlug }: Props) => {
  const db = useDb();
  const topic = db.topic.findByUniqueIndex("slug", topicSlug);

  useUpdateRouterIfSlugChanges(topic);
  useUpdateTopicLastSeenMessage(topic);

  if (!topic) {
    return <NotFound />;
  }

  return (
    <UIHolder>
      <PageMeta title={topic.name} />
      <TopicWithMessages key={topic.id} topic={topic} />
    </UIHolder>
  );
});

const UIHolder = styled.div`
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  max-height: 100vh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  ${phone(css`
    padding-bottom: 10px;
  `)}
`;
