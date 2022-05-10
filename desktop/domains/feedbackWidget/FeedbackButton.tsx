import { AnimatePresence } from "framer-motion";
import { action } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { USERSNAP_GLOBAL_API_KEY } from "@aca/desktop/lib/env";
import { desktopRouter } from "@aca/desktop/routes";
import { useIsElementOrChildHovered } from "@aca/shared/hooks/useIsElementOrChildHovered";
import { createMobxPersistedStore } from "@aca/shared/mobx/persistedStore";
import { createTimeout } from "@aca/shared/time";
import { Button } from "@aca/ui/buttons/Button";
import { TooltipLabel } from "@aca/ui/popovers/TooltipLabel";

import { openFeedbackWidget } from ".";

const inviteFriendPersistedStore = createMobxPersistedStore("invite-friend", {
  didInteract: false,
});

function useLazyFlag(time: number) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    return createTimeout(() => {
      setIsOn(true);
    }, time);
  }, [time]);

  return isOn;
}

export const FeedbackButton = observer(function FeedbackButton() {
  const didDelayToShowInitialTooltipPass = useLazyFlag(1500);
  const inviteButtonRef = useRef<HTMLDivElement>(null);

  const isInviteButtonHovered = useIsElementOrChildHovered(inviteButtonRef);

  const shouldShowTooltip =
    (didDelayToShowInitialTooltipPass && !inviteFriendPersistedStore.didInteract) || isInviteButtonHovered;

  /**
   * This method takes into account other display rules,
   * like filtering by URL path, email, logged in users and so on.
   * It means that even you call this method but widget shouldn't
   * open - it will not open
   */
  function handleFeedbackButtonClick() {
    if (!USERSNAP_GLOBAL_API_KEY) return;
    openFeedbackWidget();
    trackEvent("Feedback Button Clicked");
  }

  function handleInviteFriendClick() {
    trackEvent("Invite Friend Button Clicked");
    desktopRouter.navigate("settings", { section: "referrals" });
  }

  return (
    <UIHolder>
      <AnimatePresence>
        {shouldShowTooltip && <TooltipLabel anchorRef={inviteButtonRef} label="Have a chance to win AirPods Max" />}
      </AnimatePresence>
      <UIInviteButtonHolder
        ref={inviteButtonRef}
        onMouseEnter={action(() => {
          inviteFriendPersistedStore.didInteract = true;
        })}
      >
        <Button kind="primarySubtle" onClick={handleInviteFriendClick}>
          Invite friends
        </Button>
      </UIInviteButtonHolder>

      {USERSNAP_GLOBAL_API_KEY && (
        <Button kind="transparent" onClick={handleFeedbackButtonClick}>
          Feedback
        </Button>
      )}
    </UIHolder>
  );
});

const UIHolder = styled.div`
  display: flex;
  gap: 4px;
`;

const UIInviteButtonHolder = styled.div``;
