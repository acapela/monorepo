import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { useTopicStoreContext } from "@aca/frontend/topics/TopicStore";
import { IconButton } from "@aca/ui/buttons/IconButton";
import { IconReply } from "@aca/ui/icons";

interface Props {
  messageId: string;
}

export const ReplyButton = observer(({ messageId }: Props) => {
  const topicContext = useTopicStoreContext();

  async function handleMarkAsBeingRepliedTo() {
    if (!topicContext) return;

    runInAction(() => {
      topicContext.currentlyReplyingToMessageId = messageId;
    });
  }

  return <IconButton tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
});
