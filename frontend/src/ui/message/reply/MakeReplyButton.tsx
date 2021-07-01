import React from "react";
import { IconButton } from "~ui/buttons/IconButton";
import { IconReply } from "~ui/icons";
import { useTopicStore } from "~frontend/topics/TopicStore";
import { MessageDetailedInfoFragment } from "~gql";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const MakeReplyButton = ({ message }: Props) => {
  const [, updateTopicStore] = useTopicStore();

  async function handleMarkAsBeingRepliedTo() {
    updateTopicStore((draft) => (draft.currentlyReplyingToMessage = message));
  }

  return <IconButton tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
};
