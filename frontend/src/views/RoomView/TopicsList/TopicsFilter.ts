export type TopicsFilter = "present" | "archived" | "all";

interface TopicFilterParams {
  archived_at?: string | null;
}

export const getIsTopicArchived = ({ archived_at }: TopicFilterParams) => !!archived_at;

export const getIsTopicPresent = ({ archived_at }: TopicFilterParams) => !archived_at;
