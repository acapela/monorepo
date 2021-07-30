import React from "react";
import styled from "styled-components";
import { niceFormatDate } from "~shared/dates/format";
import { Badge } from "~ui/Badge";
import { getTopicCloseInfo } from "~frontend/topics/useTopic";
import { TopicDetailedInfoFragment } from "~gql";
import { borderRadius } from "~ui/baseStyles";
import { MessageLikeContent } from "~frontend/ui/message/messagesFeed/MessageLikeContent";

interface Props {
  topic: TopicDetailedInfoFragment;
  className?: string;
}

export const TopicSummaryMessage = styled(({ className, topic }: Props) => {
  const closeInfo = getTopicCloseInfo(topic);

  if (!closeInfo) {
    return null;
  }

  return (
    <MessageLikeContent user={closeInfo.closedByUsed} date={closeInfo.closedAt} className={className}>
      <UIHolder>
        <UIHead>
          Topic was closed by {closeInfo.closedByUsed.name ?? closeInfo.closedByUsed.email} on{" "}
          {niceFormatDate(closeInfo.closedAt)} 🎉
        </UIHead>
        {closeInfo.summary && (
          <UISummary>
            <Badge>Summary</Badge>
            {closeInfo.summary}
          </UISummary>
        )}
      </UIHolder>
    </MessageLikeContent>
  );
})``;

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
