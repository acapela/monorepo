import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useAssertCurrentUser } from "~frontend/authentication/useCurrentUser";
import { TopicEntity } from "~frontend/clientdb/topic";
import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

interface Props {
  topic: TopicEntity;
  onSendRequest?: () => void;
  onCompleteRequest?: () => void;
  onCloseRequest?: () => void;
}

type AllowedActionName = "send" | "complete" | "close-request";

type AllowedActionsInfo = {
  actions: AllowedActionName[];
  primaryAction: AllowedActionName;
};

function getAllowedActions(topic: TopicEntity): AllowedActionsInfo {
  const pendingTasksQuery = topic.tasks.query({ isDone: false });
  const hasAllTasksCompleted = !pendingTasksQuery.hasItems;
  const hasCurrentUserCompletedAssignedTasks = !pendingTasksQuery.query({ isAssignedToSelf: true }).hasItems;

  if (hasAllTasksCompleted) {
    return {
      actions: ["send", "close-request"],
      primaryAction: "close-request",
    };
  }

  // This topic has some pending tasks

  // Those are mine
  if (!hasCurrentUserCompletedAssignedTasks) {
    return {
      actions: ["send", "complete"],
      primaryAction: "complete",
    };
  }

  if (topic.isOwn) {
    return {
      actions: ["send", "close-request"],
      primaryAction: "close-request",
    };
  }

  // There is some pending task for someone else, but this is not my topic
  return {
    actions: ["send"],
    primaryAction: "send",
  };
}

export const NewMessageButtons = observer(({ topic, onSendRequest, onCompleteRequest, onCloseRequest }: Props) => {
  const currentUser = useAssertCurrentUser();
  const { actions, primaryAction } = getAllowedActions(topic);

  function handleCloseRequest() {
    onCloseRequest?.();
    topic.update({ closed_at: new Date().toISOString(), closed_by_user_id: currentUser.id });
  }

  return (
    <UIHolder>
      {actions.includes("send") && (
        <Button
          shortcut={["Enter"]}
          kind={primaryAction === "send" ? "primary" : "secondary"}
          tooltip="Send without completing pending tasks"
          onClick={onSendRequest}
        >
          Send
        </Button>
      )}
      {actions.includes("complete") && (
        <Button
          shortcut={["Mod", "C"]}
          kind={primaryAction === "complete" ? "primary" : "secondary"}
          tooltip="Send and complete pending tasks"
          onClick={onCompleteRequest}
        >
          Complete
        </Button>
      )}
      {actions.includes("close-request") && (
        <Button
          shortcut={["Mod", "X"]}
          kind={primaryAction === "close-request" ? "primary" : "secondary"}
          tooltip="Close entire request"
          onClick={handleCloseRequest}
        >
          Close request
        </Button>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  ${theme.spacing.horizontalActions.asGap};
`;
