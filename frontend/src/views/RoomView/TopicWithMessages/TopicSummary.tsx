import { gql } from "@apollo/client";
import React from "react";
import styled from "styled-components";

import { withFragments } from "~frontend/gql/utils";
import { MessageLikeContent } from "~frontend/ui/message/messagesFeed/MessageLikeContent";
import { TopicDetailedInfoFragment } from "~gql";
import { niceFormatDate } from "~shared/dates/format";
import { Badge } from "~ui/Badge";
import { borderRadius } from "~ui/baseStyles";

export const TopicSummaryMessage = withFragments(
  {
    topic: gql`
      fragment TopicSummary_topic on topic {
        closed_at
        closing_summary
        closed_by_user {
          id
        }
      }
    `,
  },
  styled<{
    topic: TopicDetailedInfoFragment;
    className?: string;
  }>(({ topic, className }) => {
    const { closed_by_user, closed_at, closing_summary } = topic;

    if (!closed_by_user || !closed_at) {
      return null;
    }

    const closedAtDate = new Date(closed_at);
    return (
      <MessageLikeContent user={closed_by_user} date={closedAtDate} className={className}>
        <UIHolder>
          <UIHead>
            Topic was closed by {closed_by_user.name ?? closed_by_user.email} on {niceFormatDate(closedAtDate)} 🎉
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
  })``
);

const UIHolder = styled.div<{}>`
  padding: 10px;

  background: #f0faf5;
  border: 1px solid #d7f4e4;
  ${borderRadius.card}
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
