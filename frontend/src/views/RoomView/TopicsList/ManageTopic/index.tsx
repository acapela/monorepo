import React, { useCallback } from "react";

import { useIsCurrentUserTopicManager } from "~frontend/topics/useIsCurrentUserTopicManager";
import { useTopic } from "~frontend/topics/useTopic";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { TopicDetailedInfoFragment } from "~gql";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

interface Props {
  topic: TopicDetailedInfoFragment;
  onRenameRequest?: () => void;
}

export const ManageTopic = ({ topic, onRenameRequest }: Props) => {
  const { deleteTopic, editName } = useTopic(topic);

  const handleDeleteSelect = useCallback(async () => {
    const isDeleteConfirmed = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (isDeleteConfirmed) {
      await deleteTopic();
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
    await editName(name);
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
};
