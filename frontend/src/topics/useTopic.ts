import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment } from "~frontend/gql/generated";
import { useDeleteTopicMutation, useUpdateTopicMutation } from "~frontend/gql/topics";

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
  const { id: currentUserId } = useAssertCurrentUser();
  const [deleteTopic, { loading: loadingDelete }] = useDeleteTopicMutation();
  const [updateTopic, { loading: isUpdating }] = useUpdateTopicMutation();

  const topicId = value?.id;
  const loading = [loadingDelete, isUpdating].some((l) => l);

  return {
    hasTopic: !!value,

    isClosed: value?.closed_at && value?.closed_by_user,

    loading,

    topicCloseInfo: getTopicCloseInfo(value),

    isParentRoomOpen: !value?.room.finished_at,

    edit: (name: string) =>
      updateTopic({
        topicId,
        input: {
          name,
        },
      }),

    close: (closing_summary: string) =>
      updateTopic({
        topicId,
        input: {
          closed_at: nowAsTimestamp(),
          closed_by_user_id: currentUserId,
          closing_summary,
        },
      }),

    open: () =>
      updateTopic({
        topicId,
        input: {
          closed_at: null,
          closed_by_user_id: null,
        },
      }),

    deleteTopic: () => deleteTopic({ topicId }),

    updateSummary: (closing_summary: string) =>
      updateTopic({
        topicId,
        input: {
          closing_summary,
        },
      }),
  } as const;
}
