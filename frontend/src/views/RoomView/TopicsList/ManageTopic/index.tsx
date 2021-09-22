import { gql, useMutation } from "@apollo/client";
import React, { useCallback } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { getCanTopicBeArchived } from "~frontend/topics/getCanTopicBeArchived";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useDeleteTopic, useUpdateTopicName } from "~frontend/views/RoomView/TopicsList/shared";
import { ArchiveTopicMutation, ArchiveTopicMutationVariables, ManageTopic_TopicFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconArchive, IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { addToast } from "~ui/toasts/data";

const fragments = {
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
  topic: ManageTopic_TopicFragment;
  onRenameRequest?: () => void;
}

export const useArchiveTopic = () =>
  useMutation<ArchiveTopicMutation, ArchiveTopicMutationVariables>(
    gql`
      mutation ArchiveTopic($id: uuid!, $archivedAt: timestamptz!) {
        topic: update_topic_by_pk(pk_columns: { id: $id }, _set: { archived_at: $archivedAt }) {
          id
          archived_at
        }
      }
    `,
    {
      optimisticResponse: ({ id, archivedAt }) => ({
        __typename: "mutation_root",
        topic: { __typename: "topic", id, archived_at: archivedAt },
      }),
      onCompleted() {
        addToast({ type: "success", title: "Topic was archived" });
      },
    }
  );

export const ManageTopic = withFragments(fragments, ({ topic, onRenameRequest }: Props) => {
  const [updateTopicName] = useUpdateTopicName();
  const [archiveTopic] = useArchiveTopic();
  const [deleteTopic] = useDeleteTopic();

  const handleArchiveTopic = async () => {
    await archiveTopic({ variables: { id: topic.id, archivedAt: new Date().toISOString() } });
  };

  const handleDeleteSelect = useCallback(async () => {
    const isDeleteConfirmed = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (isDeleteConfirmed) {
      await deleteTopic({ variables: { id: topic.id } });
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

  const isTopicManager = useIsCurrentUserTopicManager(topic);

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
