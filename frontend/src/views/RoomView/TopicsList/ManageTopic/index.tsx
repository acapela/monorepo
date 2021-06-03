import React, { useCallback } from "react";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { IconVerticalThreeDots } from "~ui/icons";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useTopic } from "~frontend/topics/useTopic";
import { openConfirmPrompt } from "~frontend/utils/confirm";
import { useRoomContext } from "../../RoomContext";
import { IconButton } from "~ui/buttons/IconButton";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const ManageTopic = ({ topic }: Props) => {
  const { edit, deleteTopic } = useTopic(topic);
  const roomContext = useRoomContext();

  const handleRenameSelect = useCallback(async () => {
    const name = await openUIPrompt({
      initialValue: topic.name || "",
      title: "Rename topic",
      submitLabel: "Rename",
      placeholder: "Enter topic name",
    });
    if (!name?.trim()) {
      return;
    }
    await edit(name);
  }, [topic.name]);

  const handleDeleteSelect = useCallback(async () => {
    const confirmation = await openConfirmPrompt({
      title: "Please confirm",
      description: `Are you sure you want to permanently delete "${topic.name}"?`,
      confirmLabel: "Delete",
    });
    if (confirmation) {
      await deleteTopic();
      roomContext?.reloadRoom();
    }
  }, [topic.name]);

  return (
    <>
      <PopoverMenu
        position="bottom-start"
        options={[
          {
            label: "Rename",
            onSelect: handleRenameSelect,
          },
          {
            label: "Delete",
            isDestructive: true,
            onSelect: handleDeleteSelect,
          },
        ]}
      >
        <IconButton icon={<IconVerticalThreeDots />} />
      </PopoverMenu>
    </>
  );
};
