import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { routes } from "~frontend/router";
import { RouteLink } from "~frontend/router/RouteLink";
import { theme } from "~ui/theme";

import { RequestParticipants } from "./RequestParticipants";

interface Props {
  topic: TopicEntity;
  isHighlighted: boolean;
}

export const RequestItem = observer(function RequestItem({ topic, isHighlighted = false }: Props) {
  return (
    <RouteLink passHref route={routes.topic} params={{ topicSlug: topic.slug }}>
      <UIFeedItem isHighlighted={isHighlighted}>
        <RequestParticipants topic={topic} />
        <UIFeedItemLabels>
          <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
          <UIFeedItemSubTitle>{"jkljkl"}</UIFeedItemSubTitle>
        </UIFeedItemLabels>
      </UIFeedItem>
    </RouteLink>
  );
});

const UIFeedItem = styled.a<{ isHighlighted?: boolean }>`
  width: 100%;

  height: 60px;
  padding: 10px;
  border-radius: 8px;

  display: grid;
  grid-template-columns: 40px 1fr;

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
`;

const UIFeedItemTitle = styled.h6<{ isSelected?: boolean }>`
  ${(props) => (props.isSelected ? theme.font.h6.medium.build() : theme.font.h6.build())}
`;

const UIFeedItemSubTitle = styled.div<{}>`
  ${theme.font.withExceptionalSize("11px", "New sizing").build()}

  opacity: 0.6;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-grow: 1;
`;
