import React from "react";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconReply } from "~ui/icons";
import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { MessageDetailedInfoFragment } from "~gql";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const ReplyButton = ({ message }: Props) => {
  const topicContext = useTopicStoreContext();

  async function handleMarkAsBeingRepliedTo() {
    topicContext.update((draft) => (draft.currentlyReplyingToMessage = message));
  }

  return <WideIconButton kind="secondary" tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
};
