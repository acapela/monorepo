import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { useRouteParams } from "~frontend/hooks/useRouteParams";
import { routes } from "~shared/routes";
import { theme } from "~ui/theme";

import { RequestContentSnippet } from "./RequestContentSnippet";
import { RequestParticipants } from "./RequestParticipants";

interface Props {
  topic: TopicEntity;
}

export const RequestItem = observer(function RequestItem({ topic }: Props) {
  const topicRouteParams = useRouteParams(routes.topic);

  // TODO: Optimize by adding some sort of selector. Now each request item will re-render or route change.
  const isHighlighted = topicRouteParams.slug === topic.slug;

  return (
    <Link passHref href={routes.topic({ topicSlug: topic.slug })}>
      <UIFeedItem isHighlighted={isHighlighted}>
        <RequestParticipants topic={topic} />
        <UIFeedItemLabels>
          <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
          <UIFeedItemSubTitle>
            <RequestContentSnippet topic={topic} />
          </UIFeedItemSubTitle>
        </UIFeedItemLabels>
      </UIFeedItem>
    </Link>
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

const UIFeedItemSubTitle = styled.div<{}>`
  ${theme.typo.item.subtitle};

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
