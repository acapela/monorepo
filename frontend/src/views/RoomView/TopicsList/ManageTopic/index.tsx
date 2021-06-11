import React, { useCallback } from "react";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { useTopic } from "~frontend/topics/useTopic";
import { OptionsButton } from "~frontend/ui/options/OptionsButton";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { openUIPrompt } from "~frontend/utils/prompt";
import { createLengthValidator } from "~shared/validation/inputValidation";
import { IconEdit, IconTrash } from "~ui/icons";
import { PopoverMenuTrigger } from "~ui/popovers/PopoverMenuTrigger";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const ManageTopic = ({ topic }: Props) => {
  const { edit, deleteTopic } = useTopic(topic);

  const handleRenameSelect = useCallback(async () => {
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
    await edit(name);
  }, [topic.name]);

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

  return (
    <>
      <PopoverMenuTrigger
        placement="bottom-start"
        options={[
          {
            label: "Rename topic",
            onSelect: handleRenameSelect,
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
        <OptionsButton />
      </PopoverMenuTrigger>
    </>
  );
};
