import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment, Topic_Set_Input } from "~gql";
import { useDeleteTopicMutation, useUpdateTopicMutation } from "~frontend/gql/topics";

function nowAsIsoString(): string {
  return new Date().toISOString();
}

export function getTopicCloseInfo(value?: TopicDetailedInfoFragment | null) {
  if (!value?.closed_at || !value?.closed_by_user) {
    return null;
  }

  return {
    closedByUsed: value.closed_by_user,
    closedAt: new Date(value.closed_at),
    summary: value.closing_summary ?? null,
  };
}

const isTruthy = (value: boolean) => value;

export function useTopic(value?: TopicDetailedInfoFragment | null) {
  const { id: currentUserId } = useAssertCurrentUser();
  const [deleteTopic, { loading: loadingDelete }] = useDeleteTopicMutation();
  const [updateTopic, { loading: isUpdating }] = useUpdateTopicMutation();

  const topicId = value?.id;
  const loading = [loadingDelete, isUpdating].some(isTruthy);

  const update = (input: Topic_Set_Input) => topicId && updateTopic({ topicId, input });

  return {
    hasTopic: !!value,

    isClosed: !!(value?.closed_at && value?.closed_by_user),

    loading,

    topicCloseInfo: getTopicCloseInfo(value),

    isParentRoomOpen: !value?.room.finished_at,

    editName: (name: string) =>
      update({
        name,
      }),

    close: (closing_summary: string) =>
      update({
        closed_at: nowAsIsoString(),
        closed_by_user_id: currentUserId,
        closing_summary,
      }),

    open: () =>
      update({
        closed_at: null,
        closed_by_user_id: null,
      }),

    updateSummary: (closing_summary: string) =>
      update({
        closing_summary,
      }),

    deleteTopic: () => topicId && deleteTopic({ topicId }),
  } as const;
}
