import React, { useCallback } from "react";
import { TopicDetailedInfoFragment } from "~gql";
import { useTopic } from "~frontend/topics/useTopic";
import { CircleOptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";

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
  }, [topic.name]);

  return (
    <>
      <PopoverMenuTrigger
        placement="bottom-start"
        options={[
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
          },
        ]}
      >
        <CircleOptionsButton />
      </PopoverMenuTrigger>
    </>
  );
};
