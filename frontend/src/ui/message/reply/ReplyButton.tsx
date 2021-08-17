import { observer } from "mobx-react";
import React from "react";

import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { MessageDetailedInfoFragment } from "~gql";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconReply } from "~ui/icons";

interface Props {
  message: MessageDetailedInfoFragment;
}

export const ReplyButton = observer(({ message }: Props) => {
  const topicContext = useTopicStoreContext();

  async function handleMarkAsBeingRepliedTo() {
    topicContext.currentlyReplyingToMessage = message;
  }

  return <WideIconButton kind="secondary" tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
});
