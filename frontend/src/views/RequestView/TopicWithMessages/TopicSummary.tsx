import React from "react";
import styled from "styled-components";

import { theme } from "~frontend/../../ui/theme";
import { TopicEntity } from "~frontend/clientdb/topic";
import { MessageLikeContent } from "~frontend/ui/message/messagesFeed/MessageLikeContent";
import { styledObserver } from "~shared/component";
import { niceFormatDate } from "~shared/dates/format";
import { Badge } from "~ui/Badge";

type Props = {
  topic: TopicEntity;
  className?: string;
};

export const TopicSummaryMessage = styledObserver<Props>(({ topic, className }) => {
  const { closedByUser, closed_at, closing_summary } = topic;

  if (!closedByUser || !closed_at) {
    return null;
  }

  const closedAtDate = new Date(closed_at);
  return (
    <MessageLikeContent user={closedByUser} date={closedAtDate} className={className}>
      <UIHolder>
        <UIHead>
          Topic was closed by {closedByUser.name ?? closedByUser.email} on {niceFormatDate(closedAtDate)} 🎉
        </UIHead>
        {closing_summary && (
          <UISummary>
            <Badge>Summary</Badge>
            {closing_summary}
          </UISummary>
        )}
      </UIHolder>
    </MessageLikeContent>
  );
})``;

const UIHolder = styled.div<{}>`
  padding: 10px;

  /* TODO PR */
  background: #f0faf5;
  border: 1px solid #d7f4e4;
  ${theme.radius.panel};
`;

const UIHead = styled.div<{}>`
  font-weight: bold;
`;

const UISummary = styled.div<{}>`
  margin-top: 16px;

  ${Badge} {
    display: inline-flex;
    margin-right: 8px;
  }
`;
