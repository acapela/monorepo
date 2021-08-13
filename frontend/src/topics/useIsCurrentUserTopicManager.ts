import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~gql";

export const useIsCurrentUserTopicManager = (topic: TopicDetailedInfoFragment): boolean => {
  const user = useAssertCurrentUser();

  // if the topic has no owner - everyone can modify the topic
  if (!topic?.owner) return true;

  // if the topic has an owner - only the topic owner or room owner can modify the topic
  return [topic?.owner?.id, topic.room?.owner?.id].includes(user.id);
};
