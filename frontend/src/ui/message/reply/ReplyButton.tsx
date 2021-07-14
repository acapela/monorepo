import React from "react";
import { WideIconButton } from "~ui/buttons/WideIconButton";
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

  return <WideIconButton kind="secondary" tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
};
