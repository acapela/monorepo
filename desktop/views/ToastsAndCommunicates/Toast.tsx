import React from "react";
import styled from "styled-components";

import { ActionData } from "@aca/desktop/actions/action";
import { ActionButton } from "@aca/desktop/ui/ActionButton";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

interface Props {
  title: string;
  description: string;
  action?: ActionData;
}

export function Toast({ title, description, action }: Props) {
  return (
    <UIToast presenceStyles={{ opacity: [0, 1], y: [10, 0] }}>
      <UIHead>
        <UITitle>{title}</UITitle>
        <UIDescription>{description}</UIDescription>
      </UIHead>

      {action && <ActionButton kind="primary" action={action} />}
    </UIToast>
  );
}

export const UIToast = styled(PresenceAnimator)`
  ${theme.colors.layout.backgroundAccent.withBorder.asBg};
  ${theme.box.previewPopover}
  ${theme.radius.primaryItem}
  ${theme.shadow.modal}
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
`;

const UIHead = styled.div``;

const UITitle = styled.div`
  ${theme.typo.content.medium}
`;
const UIDescription = styled.div`
  ${theme.typo.content}
`;
