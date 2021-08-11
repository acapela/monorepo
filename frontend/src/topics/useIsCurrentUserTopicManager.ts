import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~gql";

export const useIsCurrentUserTopicManager = (topic: TopicDetailedInfoFragment): boolean => {
  const user = useAssertCurrentUser();

  return [topic?.owner?.id, topic.room?.owner?.id].includes(user.id);
};
