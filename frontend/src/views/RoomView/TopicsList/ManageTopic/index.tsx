import React, { useCallback } from "react";
import { PopoverMenu } from "~ui/popovers/PopoverMenu";
import { IconVerticalThreeDots } from "~ui/icons";
import { TopicDetailedInfoFragment } from "~frontend/gql";
import { openUIPrompt } from "~frontend/utils/prompt";
import { useEditTopicMutation } from "~frontend/gql/topics";
import { IconButton } from "~ui/buttons/IconButton";

interface Props {
  topic: TopicDetailedInfoFragment;
}

export const ManageTopic = ({ topic }: Props) => {
  const [editTopic] = useEditTopicMutation();
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
    await editTopic({ topicId: topic.id, name });
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
        ]}
      >
        <IconButton icon={<IconVerticalThreeDots />} />
      </PopoverMenu>
    </>
  );
};
