import React from "react";
import styled from "styled-components";
import { UserBasicInfoFragment } from "~gql";
import { MessageLikeContent } from "./MessageLikeContent";

interface Props {
  summary: string;
  closedAt: Date;
  closedBy: UserBasicInfoFragment;
  className?: string;
}

function enrichSummary(summary: string) {
  if (summary && summary.trim().length > 0) {
    return [{ insert: "Outcome of the topic: ", attributes: { bold: true } }, { insert: summary }];
  }
  return [{ insert: "🎉", attributes: { bold: true } }];
}

export const TopicSummaryMessage = styled(({ summary, closedAt, closedBy, className }: Props) => {
  return (
    <MessageLikeContent
      hideMessageHead
      user={closedBy}
      date={closedAt}
      messageTypeLabel="closed this topic"
      className={className}
    >
      <strong> Outcome of the topic: {summary}</strong>
    </MessageLikeContent>
  );
})``;
