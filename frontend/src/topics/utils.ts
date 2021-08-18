import { gql } from "@apollo/client";

import { withFragments } from "~frontend/gql/utils";
import { IsTopicClosed_TopicFragment } from "~gql";

export const isTopicClosed = withFragments(
  {
    topic: gql`
      fragment IsTopicClosed_topic on topic {
        closed_at
        closed_by_user_id
      }
    `,
  },
  (topic: IsTopicClosed_TopicFragment) => Boolean(topic.closed_at && topic.closed_by_user_id)
);

export function byIndexAscending(a: { index: string }, b: { index: string }) {
  if (a.index < b.index) return -1;
  if (a.index > b.index) return 1;
  return 0;
}
