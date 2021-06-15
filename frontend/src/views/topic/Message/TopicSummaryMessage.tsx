import React from "react";
import { UserBasicInfoFragment } from "~gql";
import { Message } from ".";

interface Props {
  summary: string;
  closedAt: string;
  closedBy: UserBasicInfoFragment;
}

function enrichSummary(summary: string) {
  if (summary && summary.trim().length > 0) {
    return [{ insert: "Outcome of the topic: ", attributes: { bold: true } }, { insert: summary }];
  }
  return [{ insert: "🎉", attributes: { bold: true } }];
}

export const TopicSummaryMessage = ({ summary, closedAt, closedBy }: Props) => (
  <Message
    isTopicSummary={true}
    key={"closing-topic"}
    message={{
      id: "closing-topic",
      type: "TEXT",
      content: enrichSummary(summary),
      createdAt: closedAt,
      user: closedBy,
      transcription: null,
      message_attachments: [],
    }}
  />
);
