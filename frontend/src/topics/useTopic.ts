import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { useDeleteTopicMutation, useEditTopicMutation, useToggleCloseTopicMutation } from "~frontend/gql/topics";

function nowAsTimestamp(): string {
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
  const { id: closedByUserId } = useAssertCurrentUser();

  const [toggleClosed, { loading: loadingToggleClose }] = useToggleCloseTopicMutation();
  const [edit, { loading: loadingEdit }] = useEditTopicMutation();
  const [deleteTopic, { loading: loadingDelete }] = useDeleteTopicMutation();

  const topicId = value?.id;
  const loading = [loadingEdit, loadingToggleClose, loadingDelete].some((l) => l);

  return {
    hasTopic: !!value,

    isClosed: value?.closed_at && value?.closed_by_user,

    loading,

    topicCloseInfo: getTopicCloseInfo(value),

    edit: (name: string) => edit({ topicId, name }),

    close: (summary: string) => toggleClosed({ topicId, closedAt: nowAsTimestamp(), closedByUserId, summary }),

    open: () => toggleClosed({ topicId, closedAt: null, closedByUserId: null }),

    deleteTopic: () => deleteTopic({ topicId }),
  } as const;
}
