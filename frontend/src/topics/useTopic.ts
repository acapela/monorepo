import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { useToggleCloseTopicMutation } from "~frontend/gql/topics";

function now() {
  return new Date().toISOString();
}

export function useTopic(value?: TopicDetailedInfoFragment | null) {
  const { id: closedBy } = useAssertCurrentUser();
  const [toggleClosed, { loading }] = useToggleCloseTopicMutation();

  const topicId = value?.id;

  return [
    {
      isOpen: !value?.closed_at && !value?.closed_by_user,
      loading,
      close: (summary: string) => toggleClosed({ topicId, closedAt: now(), closedBy, summary }),
      open: () => toggleClosed({ topicId, closedAt: null, closedBy: null }),
    },
  ] as const;
}
