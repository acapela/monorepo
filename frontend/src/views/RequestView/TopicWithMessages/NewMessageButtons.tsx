import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { TaskEntity } from "~frontend/clientdb/task";
import { TopicEntity } from "~frontend/clientdb/topic";
import { REQUEST_ACTION, REQUEST_READ, REQUEST_RESPONSE } from "~shared/types/mention";
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

function getAllowedActions(pendingTasks: TaskEntity[]): AllowedActionsInfo {
  if (pendingTasks.length > 0) {
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

function getTaskCompletionCTA(pendingTasks: TaskEntity[]): string {
  if (pendingTasks.length === 0) {
    return "";
  }

  if (pendingTasks.length > 1) {
    return "Mark all as done";
  }
  const taskType = pendingTasks[0].type;
  if (taskType === REQUEST_READ) {
    return "Mark as read";
  }
  if (taskType === REQUEST_ACTION) {
    return "Mark as done";
  }
  if (taskType === REQUEST_RESPONSE) {
    return "Mark as replied";
  }
  return "";
}

export const NewMessageButtons = observer(({ topic, onSendRequest, onCompleteRequest, canSend }: Props) => {
  const pendingTasks = topic.tasks.query({ isDone: false, isAssignedToSelf: true }).all;

  const { actions, primaryAction } = getAllowedActions(pendingTasks);
  const taskCompletionCTA = getTaskCompletionCTA(pendingTasks);

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
          onClick={onCompleteRequest}
        >
          {taskCompletionCTA}
        </Button>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  ${theme.spacing.actions.asGap};
`;
