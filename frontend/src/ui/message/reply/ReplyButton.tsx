import React from "react";
import { IconButton } from "~ui/buttons/IconButton";
import { IconReply } from "~ui/icons";
import { useTopicStoreUpdate } from "~frontend/topics/TopicStore";
import { MessageDetailedInfoFragment } from "~gql";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const ReplyButton = ({ message }: Props) => {
  const updateTopicStore = useTopicStoreUpdate();

  async function handleMarkAsBeingRepliedTo() {
    updateTopicStore((draft) => (draft.currentlyReplyingToMessage = message));
  }

  return <IconButton tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
};
