import { ManageTopic_TopicFragment } from "~gql";

export const getCanTopicBeArchived = ({ closed_at, archived_at }: ManageTopic_TopicFragment) =>
  closed_at && archived_at;
