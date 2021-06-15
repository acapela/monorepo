import React from "react";
import { Message_Type_Enum, UserBasicInfoFragment } from "~gql";
import { MessageLikeContent } from "./MessageLikeContent";

interface Props {
  summary: string;
  closedAt: Date;
  closedBy: UserBasicInfoFragment;
}

function enrichSummary(summary: string) {
  if (summary && summary.trim().length > 0) {
    return [{ insert: "Outcome of the topic: ", attributes: { bold: true } }, { insert: summary }];
  }
  return [{ insert: "🎉", attributes: { bold: true } }];
}

export const TopicSummaryMessage = ({ summary, closedAt, closedBy }: Props) => {
  console.log({ closedAt });
  return (
    <MessageLikeContent user={closedBy} date={closedAt} messageTypeLabel="closed this topic">
      <strong> Outcome of the topic: {summary}</strong>
    </MessageLikeContent>
  );
};
