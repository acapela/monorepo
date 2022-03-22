import React from "react";

import { trackEvent } from "@aca/desktop/analytics";
import { USERSNAP_GLOBAL_API_KEY } from "@aca/desktop/lib/env";
import { Button } from "@aca/ui/buttons/Button";

import { useUsersnapApi } from ".";

export function FeedbackButton() {
  if (!USERSNAP_GLOBAL_API_KEY) {
    return null;
  }
  const usersnapApi = useUsersnapApi();

  /**
   * This method takes into account other display rules,
   * like filtering by URL path, email, logged in users and so on.
   * It means that even you call this method but widget shouldn't
   * open - it will not open
   */
  function handleOpenWidgetIfAllowed() {
    usersnapApi.logEvent("feedback_button_clicked");
    trackEvent("Feedback Button Clicked");
  }

  return (
    <Button kind="transparent" onClick={handleOpenWidgetIfAllowed}>
      Feedback
    </Button>
  );
}
