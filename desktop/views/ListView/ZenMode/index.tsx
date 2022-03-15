import React from "react";
import styled from "styled-components";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import zenImage from "@aca/desktop/assets/zen/today.jpg";
import { PresenceAnimator } from "@aca/ui/PresenceAnimator";
import { theme } from "@aca/ui/theme";

export function ListViewZenOverlay() {
  return (
    <UIHolder
      presenceStyles={{ opacity: [0, 1], scale: [1.2, 1] }}
      transition={{ type: "spring", duration: 5, bounce: 0 }}
    >
      <UINotificationZeroPanel
        presenceStyles={{ opacity: [0, 1] }}
        transition={{ type: "spring", duration: 5, bounce: 0, delay: 1.5 }}
      >
        You've reached notification zero.
      </UINotificationZeroPanel>
    </UIHolder>
  );
}

const UIHolder = styled(PresenceAnimator)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-image: url(${zenImage as unknown as string});
  background-size: cover;
  background-position: center;
  padding: 60px;
  justify-content: flex-end;
  align-items: flex-start;
`;

const UINotificationZeroPanel = styled(PresenceAnimator)`
  align-items: center;
  justify-content: center;
  text-align: center;
  display: inline-flex;
  padding: 30px 45px;
  ${theme.colors.layout.background.opacity(0.7).asBg};
  ${theme.typo.secondaryTitle.semibold}
  backdrop-filter: blur(16px);
  ${theme.radius.primaryItem}
`;
