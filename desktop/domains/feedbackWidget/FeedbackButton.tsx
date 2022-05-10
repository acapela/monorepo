import React from "react";
import styled from "styled-components";

import { trackEvent } from "@aca/desktop/analytics";
import { USERSNAP_GLOBAL_API_KEY } from "@aca/desktop/lib/env";
import { desktopRouter } from "@aca/desktop/routes";
import { Button } from "@aca/ui/buttons/Button";

import { openFeedbackWidget } from ".";

export function FeedbackButton() {
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
      <Button kind="transparent" onClick={handleInviteFriendClick}>
        Invite a friend
      </Button>
      {USERSNAP_GLOBAL_API_KEY && (
        <Button kind="transparent" onClick={handleFeedbackButtonClick}>
          Feedback
        </Button>
      )}
    </UIHolder>
  );
}

const UIHolder = styled.div`
  display: flex;
  gap: 4px;
`;
