import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { sendFeedback } from "@aca/desktop/actions/app";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { FadePresenceAnimator } from "@aca/ui/animations";
import { BodyPortal } from "@aca/ui/BodyPortal";
import { Button } from "@aca/ui/buttons/Button";
import { UISpinner } from "@aca/ui/Spinner";
import { theme } from "@aca/ui/theme";

interface Props {
  onCancel: () => void;
}

export const AwaitingCheckoutCover = observer(({ onCancel }: Props) => {
  return (
    <BodyPortal>
      <UIHolder>
        <UIHead>
          <UISpinner />
          <UITitle>Continue the checkout in your browser</UITitle>
        </UIHead>

        <UIActions>
          <Button onClick={onCancel} kind="primarySubtle">
            Cancel
          </Button>
          <ActionButton kind="transparent" size="compact" action={sendFeedback} hideIcon hideTooltip>
            Report an issue
          </ActionButton>
        </UIActions>
      </UIHolder>
    </BodyPortal>
  );
});

const UIHolder = styled(FadePresenceAnimator)`
  display: flex;
  position: fixed;
  inset: 0;
  ${theme.colors.layout.background.opacity(0.95).asBgWithReadableText};
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  z-index: ${theme.zIndex.top};

  ${UISpinner} {
    font-size: 32px;
  }
`;

const UIHead = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const UITitle = styled.div`
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
`;

const UIActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
`;
