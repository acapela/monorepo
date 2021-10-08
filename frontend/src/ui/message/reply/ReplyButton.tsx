import { runInContext } from "lodash";
import { observer } from "mobx-react";
import React from "react";

import { useTopicStoreContext } from "~frontend/topics/TopicStore";
import { WideIconButton } from "~ui/buttons/WideIconButton";
import { IconReply } from "~ui/icons";

interface Props {
  messageId: string;
}

export const ReplyButton = observer(({ messageId }: Props) => {
  const topicContext = useTopicStoreContext();

  async function handleMarkAsBeingRepliedTo() {
    if (!topicContext) return;

    runInContext(() => {
      topicContext.currentlyReplyingToMessageId = messageId;
    });
  }

  return <WideIconButton kind="secondary" tooltip="Reply" onClick={handleMarkAsBeingRepliedTo} icon={<IconReply />} />;
});
