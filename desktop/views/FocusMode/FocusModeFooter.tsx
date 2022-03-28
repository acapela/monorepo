import React from "react";

import {
  exitFocusMode,
  focusOnNotificationPreview,
  goToNextNotification,
  goToPreviousNotification,
} from "@aca/desktop/actions/focus";
import { openNotificationInApp, resolveNotification, snoozeNotification } from "@aca/desktop/actions/notification";
import { ShortcutsFooter } from "@aca/desktop/ui/ShortcutsFooter";

export function FocusModeFooter() {
  return (
    <ShortcutsFooter
      actions={[
        exitFocusMode,
        focusOnNotificationPreview,
        goToNextNotification,
        goToPreviousNotification,
        resolveNotification,
        snoozeNotification,
        openNotificationInApp,
      ]}
    />
  );
}
