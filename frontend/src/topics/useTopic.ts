import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { useToggleCloseTopicMutation } from "~frontend/gql/topics";

export function useTopic(value?: TopicDetailedInfoFragment | null) {
  const user = useAssertCurrentUser();
  const [toggleClosed, { loading }] = useToggleCloseTopicMutation();

  const topicId = value?.id;

  return [
    {
      isOpen: !value?.closed_at && !value?.closed_by_user,
      loading,
      close: () => toggleClosed({ topicId, closedAt: new Date().toISOString(), closedBy: user.id }),
      open: () => toggleClosed({ topicId, closedAt: null, closedBy: null }),
    },
  ] as const;
}
