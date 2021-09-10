import { gql, useMutation } from "@apollo/client";
import { observer } from "mobx-react-lite";
import React, { useCallback } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { RoomEntity } from "~frontend/clientdb/room";
import { TopicEntity } from "~frontend/clientdb/topic";
import { getCanTopicBeArchived } from "~frontend/topics/getCanTopicBeArchived";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { ArchiveTopicMutation, ArchiveTopicMutationVariables } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconArchive, IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { addToast } from "~ui/toasts/data";

interface Props {
  room: RoomEntity;
  topic: TopicEntity;
  onRenameRequest?: () => void;
}

export const useArchiveTopic = () =>
  useMutation<ArchiveTopicMutation, ArchiveTopicMutationVariables & { roomId: string }>(
    gql`
      mutation ArchiveTopic($id: uuid!, $archivedAt: timestamptz!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { archived_at: $archivedAt }) {
          id
          room_id
          archived_at
        }
      }
    `,
    {
      optimisticResponse: ({ id, roomId, archivedAt }) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id, room_id: roomId, archived_at: archivedAt },
      }),
      onCompleted() {
        addToast({ type: "success", title: "Topic was archived" });
      },
    }
  );

export const ManageTopic = observer(({ room, topic, onRenameRequest }: Props) => {
  const handleArchiveTopic = () => {
    topic.update({ archived_at: new Date().toISOString() });
  };

  const handleDeleteSelect = useCallback(async () => {
    const isDeleteConfirmed = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (isDeleteConfirmed) {
      topic.remove();
      trackEvent("Deleted Topic", { topicId: topic.id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.name]);

  const handleRenameWithModal = useCallback(async () => {
    const name = await openUIPrompt({
      initialValue: topic.name || "",
      title: "Rename topic",
      submitLabel: "Rename",
      placeholder: "Enter topic name",
      validateInput: createLengthValidator("Topic name", 3),
    });

    if (!name?.trim()) {
      return;
    }
    topic.update({ name });
    trackEvent("Renamed Topic", { topicId: topic.id, newTopicName: name, oldTopicName: topic.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.name]);

  const isTopicManager = useIsCurrentUserTopicManager(room, topic);

  const options = [];
  if (isTopicManager) {
    options.push({
      label: "Rename topic",
      onSelect: onRenameRequest ?? handleRenameWithModal,
      icon: <IconEdit />,
    });

    if (getCanTopicBeArchived(topic)) {
      options.push({
        label: "Archive topic",
        onSelect: handleArchiveTopic,
        icon: <IconArchive />,
      });
    }

    options.push({
      label: "Delete topic",
      isDestructive: true,
      onSelect: handleDeleteSelect,
      icon: <IconTrash />,
    });
  }

  if (options.length < 1) return null;

  return (
    <>
      <PopoverMenuTrigger placement="bottom-start" options={options}>
        <CircleOptionsButton />
      </PopoverMenuTrigger>
    </>
  );
});
