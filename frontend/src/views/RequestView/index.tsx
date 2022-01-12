import { gql, useMutation } from "@apollo/client";
import { autorun, reaction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled, { css } from "styled-components";

import { useDb } from "@aca/frontend/clientdb";
import { TopicEntity } from "@aca/frontend/clientdb/topic";
import { PageMeta } from "@aca/frontend/utils/PageMeta";
import { JoinTopicMutation, JoinTopicMutationVariables } from "@aca/gql";
import { devAssignWindowVariable } from "@aca/shared/dev";
import { useIsMountedRef } from "@aca/shared/hooks/useIsMountedRef";
import { phone } from "@aca/ui/responsive";

import { NotFound } from "./NotFound";
import { TopicWithMessages } from "./TopicWithMessages";

interface Props {
  topic: TopicEntity | null;
}

/**
 * In case topic slug changes while we have it opened, replace the router so we still have it opened.
 */
function useUpdateRouterIfSlugChanges(topic: TopicEntity | null) {
  const router = useRouter();
  const isMounted = useIsMountedRef();
  useEffect(() => {
    if (!topic) return;
    let isFirstRun = true;

    return reaction(
      () => topic.href,
      (href) => {
        if (isFirstRun) {
          isFirstRun = false;
          return;
        }

        if (!isMounted.current) return;

        router.replace(href);
      }
    );
  }, [router, topic, isMounted]);
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

      if (!lastMessage) {
        console.warn(`Topic has no messages - skipping setting last seen message`);
        return;
      }

      const nowISO = new Date().toISOString();

      if (lastSeenMessageInfo) {
        lastSeenMessageInfo.update({ seen_at: nowISO, message_id: lastMessage?.id });

        return;
      }

      db.lastSeenMessage.create({ topic_id: topic.id, message_id: lastMessage.id, seen_at: nowISO });
    });
  }, [topic, db]);
}

export const RequestView = observer(({ topic }: Props) => {
  devAssignWindowVariable("topic", topic);
  const [joinTopic] = useMutation<JoinTopicMutation, JoinTopicMutationVariables>(
    gql`
      mutation JoinTopic($accessToken: uuid!) {
        join_topic(access_token: $accessToken) {
          success
        }
      }
    `
  );

  const router = useRouter();

  useUpdateRouterIfSlugChanges(topic);
  useUpdateTopicLastSeenMessage(topic);

  const accessToken = router.query.access_token;
  useEffect(() => {
    const removeAccessTokenFromQuery = () => {
      const url = new URL(router.asPath, location.origin);
      url.searchParams.delete("access_token");
      router.replace(url, undefined, { shallow: true });
    };

    if (!topic && typeof accessToken == "string") {
      joinTopic({ variables: { accessToken } }).then(({ data }) => {
        if (data?.join_topic?.success) {
          // the success case will trigger a sync of the newly synced topic, which will lead
          // to the token being removed from the query once it's completed
        } else {
          // we log any errors on the backend site, where we also have more context
          // otherwise we 'd just strip the access token, thus showing topic not found
          removeAccessTokenFromQuery();
        }
      });
    }
    if (topic && accessToken) {
      removeAccessTokenFromQuery();
    }
  }, [accessToken, joinTopic, router, topic]);

  if (accessToken) {
    return null;
  }

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
