import { observer } from "mobx-react";
import styled from "styled-components";

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
  return {
    actions: ["send", "complete"],
    primaryAction: "complete",
  };
}

export const NewMessageButtons = observer(({ topic, onSendRequest, onCompleteRequest, onCloseRequest }: Props) => {
  const { actions, primaryAction } = getAllowedActions(topic);
  return (
    <UIHolder>
      {actions.includes("send") && (
        <Button
          shortcut={["Mod", "Enter"]}
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
          onClick={onCloseRequest}
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
