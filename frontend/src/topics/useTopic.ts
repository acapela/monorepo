import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicDetailedInfoFragment, Topic_Set_Input } from "~gql";
import { useDeleteTopicMutation, useUpdateTopicMutation } from "~frontend/gql/topics";
import { trackEvent } from "~frontend/analytics/tracking";

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

export function useTopic(topic: TopicDetailedInfoFragment) {
  const { id: currentUserId } = useAssertCurrentUser();
  const [deleteTopic, { loading: loadingDelete }] = useDeleteTopicMutation();
  const [updateTopic, { loading: isUpdating }] = useUpdateTopicMutation();

  const topicId = topic.id;
  const loading = [loadingDelete, isUpdating].some(isTruthy);

  const update = (input: Topic_Set_Input) => topicId && updateTopic({ topicId, input });

  return {
    isClosed: !!(topic.closed_at && topic.closed_by_user),

    loading,

    topicCloseInfo: getTopicCloseInfo(topic),

    isParentRoomOpen: !topic.room.finished_at,

    editName: (name: string) => {
      const oldTopicName = topic.name;
      update({
        name,
      });
      trackEvent("Renamed Topic", { topicId, newTopicName: name, oldTopicName });
    },

    close: (closing_summary: string) => {
      update({
        closed_at: nowAsIsoString(),
        closed_by_user_id: currentUserId,
        closing_summary,
      });
      trackEvent("Closed Topic", { topicId });
    },

    open: () => {
      update({
        closed_at: null,
        closed_by_user_id: null,
      });
      trackEvent("Reopened Topic");
    },

    updateSummary: (closing_summary: string) => {
      update({
        closing_summary,
      });
      trackEvent("Updated Topic Summary", { topicId });
    },

    deleteTopic: () => {
      deleteTopic({ topicId });
      trackEvent("Deleted Topic", { topicId });
    },
  } as const;
}
