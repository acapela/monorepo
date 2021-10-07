import { observer } from "mobx-react";
import React from "react";
import styled, { css } from "styled-components";

import { useDb } from "~frontend/clientdb";
import { routes } from "~frontend/router";
import { RouteLink } from "~frontend/router/RouteLink";
import { theme } from "~ui/theme";

import { RequestParticipants } from "./RequestParticipants";

interface Props {
  topicId: string;
  isHighlighted: boolean;
}

export const RequestItem = observer(function RequestItem({ topicId, isHighlighted = false }: Props) {
  const db = useDb();

  const topic = db.topic.findById(topicId);

  if (!topic) {
    return null;
  }

  return (
    <RouteLink passHref route={routes.topic} params={{ topicId }}>
      <UIFeedItem isHighlighted={isHighlighted}>
        <RequestParticipants topic={topic} />
        <UIFeedItemLabels>
          <UIFeedItemTitle>{topic.name}</UIFeedItemTitle>
          <UIFeedItemSubTitle>{""}</UIFeedItemSubTitle>
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

  ${(props) =>
    props.isHighlighted &&
    css`
      &&& {
        /* TODO: Move to theme */
        background-color: #ff57e3;
        color: ${theme.colors.layout.foreground()};
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
