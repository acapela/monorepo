import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TopicEntity } from "~frontend/clientdb/topic";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

interface Props {
  topic: TopicEntity;
  onSendRequest?: () => void;
  onCompleteRequest?: () => void;
  canSend: boolean;
}

type AllowedActionName = "send" | "complete";

type AllowedActionsInfo = {
  actions: AllowedActionName[];
  primaryAction: AllowedActionName;
};

function getAllowedActions(topic: TopicEntity): AllowedActionsInfo {
  const pendingTasksQuery = topic.tasks.query({ isDone: false });
  const hasCurrentUserCompletedAssignedTasks = !pendingTasksQuery.query({ isAssignedToSelf: true }).hasItems;

  if (!hasCurrentUserCompletedAssignedTasks) {
    return {
      actions: ["send", "complete"],
      primaryAction: "complete",
    };
  }

  return {
    actions: ["send"],
    primaryAction: "send",
  };
}

export const NewMessageButtons = observer(({ topic, onSendRequest, onCompleteRequest, canSend }: Props) => {
  const { actions, primaryAction } = getAllowedActions(topic);

  return (
    <UIHolder>
      {actions.includes("send") && (
        <Button
          shortcut={["Mod", "Enter"]}
          kind={primaryAction === "send" ? "primary" : "secondary"}
          tooltip="Send without marking your part as done"
          onClick={onSendRequest}
          isDisabled={!canSend}
        >
          Send
        </Button>
      )}
      {actions.includes("complete") && (
        <Button
          shortcut={["Mod", "Shift", "Enter"]}
          kind={primaryAction === "complete" ? "primary" : "secondary"}
          tooltip="Mark your part as done"
          onClick={onCompleteRequest}
        >
          Mark as Done
        </Button>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  ${theme.spacing.actions.asGap};
`;
