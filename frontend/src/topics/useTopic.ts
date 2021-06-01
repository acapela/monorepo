/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { assert } from "~shared/assert";
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
  const isClosed = value?.closed_at && value?.closed_by_user;

  return {
    hasTopic: !!value,
    isOpen: !isClosed,
    isClosed,
    loading,
    close: (summary: string) => toggleClosed({ topicId, closedAt: now(), closedBy, summary }),
    open: () => toggleClosed({ topicId, closedAt: null, closedBy: null }),
    closedByUser() {
      assert(!!value?.closed_by_user, "Topic not closed yet");
      return value.closed_by_user!;
    },
    closedAt() {
      assert(!!value?.closed_at, "Topic not closed yet");
      return value.closed_at!;
    },
    closingSummary() {
      assert(!!value?.closing_summary, "Topic not closed yet");
      return value.closing_summary!;
    },
  } as const;
}
