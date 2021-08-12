import { gql } from "@apollo/client";
import React, { useCallback } from "react";

import { trackEvent } from "~frontend/analytics/tracking";
import { withFragments } from "~frontend/gql/utils";
import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useUpdateTopic } from "~frontend/views/RoomView/shared";
import { useDeleteTopic } from "~frontend/views/RoomView/TopicsList/shared";
import { ManageTopic_TopicFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

const fragments = {
  topic: gql`
    fragment ManageTopic_topic on topic {
      id
      name
    }
  `,
};

interface Props {
  topic: ManageTopic_TopicFragment;
  onRenameRequest?: () => void;
}

export const ManageTopic = withFragments(fragments, ({ topic, onRenameRequest }: Props) => {
  const [updateTopic] = useUpdateTopic();
  const [deleteTopic] = useDeleteTopic();

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
    await updateTopic({ variables: { id: topic.id, input: { name } } });
    trackEvent("Renamed Topic", { topicId: topic.id, newTopicName: name, oldTopicName: topic.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic.name]);

  const isTopicManager = useIsCurrentUserTopicManager(topic);

  const options = [];
  if (isTopicManager) {
    options.push(
      {
        label: "Rename topic",
        onSelect: onRenameRequest ?? handleRenameWithModal,
        icon: <IconEdit />,
      },
      {
        label: "Delete topic",
        isDestructive: true,
        onSelect: handleDeleteSelect,
        icon: <IconTrash />,
      }
    );
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
