import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { routes } from "~frontend/router";
import { RouteLink } from "~frontend/router/RouteLink";
import { HStack } from "~ui/Stack";
import { theme } from "~ui/theme";

import { RequestContentSnippet } from "./RequestContentSnippet";
import { RequestParticipants } from "./RequestParticipants";

interface Props {
  topic: TopicEntity;
}

export const RequestItem = observer(function RequestItem({ topic }: Props) {
  const topicRouteParams = routes.topic.useParams();

  // TODO: Optimize by adding some sort of selector. Now each request item will re-render or route change.
  const isHighlighted = topicRouteParams?.route.topicSlug === topic.slug;

  const unreadMessagesCount = topic.unreadMessages.count;
  return (
    <RouteLink passHref route={routes.topic} params={{ topicSlug: topic.slug }}>
      <UIFeedItem isHighlighted={isHighlighted}>
        <RequestParticipants topic={topic} />
        <UIFeedItemLabels>
          <HStack alignItems="center">
            <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
            {unreadMessagesCount > 0 && <UIBubble>{unreadMessagesCount}</UIBubble>}
          </HStack>
          <UIFeedItemSubTitle>
            <RequestContentSnippet topic={topic} />
          </UIFeedItemSubTitle>
        </UIFeedItemLabels>
      </UIFeedItem>
    </RouteLink>
  );
});

const UIFeedItem = styled.a<{ isHighlighted?: boolean }>`
  display: flex;
  ${theme.box.item};
  ${theme.spacing.horizontalActions.asGap};
  ${theme.radius.primaryItem}

  align-items: center;

  ${theme.transitions.hover()};

  &:hover {
    background-color: hsla(0, 0%, 0%, 0.025);
  }

  ${(props) =>
    props.isHighlighted &&
    css`
      &&& {
        background-color: hsla(0, 0%, 0%, 0.05);
      }
    `}
`;

const UIFeedItemLabels = styled.div<{}>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

const UIFeedItemTitle = styled.h6`
  ${theme.typo.content.semibold.resetLineHeight};
`;

const UIBubble = styled.div`
  border-radius: 40px;
  margin-left: 6px;
  width: 16px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 8px;
  font-weight: 600;
  line-height: 1;
  background-color: rgba(0, 0, 0, 0.05);
`;

const UIFeedItemSubTitle = styled.div<{}>`
  ${theme.typo.item.subtitle};

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
