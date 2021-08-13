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

export function useTopic(topic: TopicDetailedInfoFragment | null) {
  const { id: currentUserId } = useAssertCurrentUser();
  const [deleteTopic, { loading: isDeleting }] = useDeleteTopicMutation();
  const [updateTopic, { loading: isUpdating }] = useUpdateTopicMutation();

  const topicId = topic?.id ?? null;
  const loading = [isDeleting, isUpdating].some(isTruthy);

  const update = (input: Topic_Set_Input) => topicId && updateTopic({ topicId, input });

  return {
    isClosed: !!(topic?.closed_at && topic?.closed_by_user),

    loading,

    topicCloseInfo: getTopicCloseInfo(topic),

    isParentRoomOpen: !topic?.room.finished_at ?? false,

    editName: (name: string) => {
      if (!topic) return;
      const oldTopicName = topic.name;
      update({
        name,
      });
      trackEvent("Renamed Topic", { topicId: topic.id, newTopicName: name, oldTopicName });
    },

    close: (closing_summary: string) => {
      if (!topic) return;
      update({
        closed_at: nowAsIsoString(),
        closed_by_user_id: currentUserId,
        closing_summary,
      });
      trackEvent("Closed Topic", { topicId: topic.id });
    },

    open: () => {
      update({
        closed_at: null,
        closed_by_user_id: null,
      });
      trackEvent("Reopened Topic");
    },

    updateSummary: (closing_summary: string) => {
      if (!topic) return;
      update({
        closing_summary,
      });
      trackEvent("Updated Topic Summary", { topicId: topic.id });
    },

    deleteTopic: () => {
      if (!topic) return;
      deleteTopic({ topicId: topic.id });
      trackEvent("Deleted Topic", { topicId: topic.id });
    },
  } as const;
}
