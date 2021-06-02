/* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { assert } from "~shared/assert";
import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { useToggleCloseTopicMutation } from "~frontend/gql/topics";

function now() {
  return new Date().toISOString();
}

function getTopicCloseInfo(value?: TopicDetailedInfoFragment | null) {
  return value?.closed_at && value?.closed_by_user
    ? {
        closedByUsedId: value.closed_by_user,
        closedAt: value.closed_at,
        summary: value.closing_summary ?? "",
      }
    : null;
}

export function useTopic(value?: TopicDetailedInfoFragment | null) {
  const { id: closedBy } = useAssertCurrentUser();
  const [toggleClosed, { loading }] = useToggleCloseTopicMutation();

  const topicId = value?.id;

  return {
    hasTopic: !!value,

    isClosed: value?.closed_at && value?.closed_by_user,

    loading,

    close: (summary: string) => toggleClosed({ topicId, closedAt: now(), closedBy, summary }),

    open: () => toggleClosed({ topicId, closedAt: null, closedBy: null }),

    topicCloseInfo: getTopicCloseInfo(value),
  } as const;
}
