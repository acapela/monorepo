import { gql } from "@apollo/client";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { withFragments } from "~frontend/gql/utils";
import { IsCurrentUserTopicManager_TopicFragment } from "~gql";

const fragments = {
  topic: gql`
    fragment IsCurrentUserTopicManager_topic on topic {
      owner_id
    }
  `,
};
export const useIsCurrentUserTopicManager = withFragments(
  fragments,
  (topic: IsCurrentUserTopicManager_TopicFragment | null) => {
    const user = useAssertCurrentUser();

    // if the topic has an owner - only the topic owner or room owner can modify the topic
    return Boolean(topic && [topic.owner_id].includes(user.id));
  }
);
