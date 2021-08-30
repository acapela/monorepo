import { gql } from "@apollo/client";
import React, { useCallback } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useArchiveTopic, useDeleteTopic, useUpdateTopicName } from "~frontend/views/RoomView/TopicsList/shared";
import { ManageTopic_RoomFragment, ManageTopic_TopicFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconArchive, IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

const fragments = {
  room: gql`
    ${useIsCurrentUserTopicManager.fragments.room}

    fragment ManageTopic_room on room {
      id
      ...IsCurrentUserTopicManager_room
    }
  `,
  topic: gql`
    ${useIsCurrentUserTopicManager.fragments.topic}

    fragment ManageTopic_topic on topic {
      id
      name
      closed_at
      archived_at
      ...IsCurrentUserTopicManager_topic
    }
  `,
};

interface Props {
  room: ManageTopic_RoomFragment;
  topic: ManageTopic_TopicFragment;
  onRenameRequest?: () => void;
}

export const ManageTopic = withFragments(fragments, ({ room, topic, onRenameRequest }: Props) => {
  const [updateTopicName] = useUpdateTopicName();
  const [archiveTopic] = useArchiveTopic();
  const [deleteTopic] = useDeleteTopic();

  const handleArchiveTopic = async () => {
    await archiveTopic({ variables: { id: topic.id, roomId: room.id, archivedAt: new Date().toISOString() } });
  };

  const handleDeleteSelect = useCallback(async () => {
    const isDeleteConfirmed = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (isDeleteConfirmed) {
      await deleteTopic({ variables: { id: topic.id, roomId: room.id } });
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
    await updateTopicName({ variables: { id: topic.id, name } });
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

    if (topic.closed_at && !topic.archived_at) {
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
