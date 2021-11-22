import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { Button } from "~ui/buttons/Button";
import { theme } from "~ui/theme";

interface Props {
  onSendRequest?: () => void;
  canSend: boolean;
}

export const SubmitMessageButton = observer(({ onSendRequest, canSend }: Props) => {
  return (
    <UIHolder>
      <Button shortcut={["Mod", "Enter"]} kind="primary" onClick={onSendRequest} isDisabled={!canSend}>
        Send
      </Button>
    </UIHolder>
  );
});

const UIHolder = styled.div<{}>`
  display: flex;
  ${theme.spacing.actions.asGap};
`;
