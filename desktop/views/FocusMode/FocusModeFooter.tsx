import React from "react";

import {
  exitFocusMode,
  focusOnNotificationPreview,
  goToNextNotification,
  goToPreviousNotification,
} from "@aca/desktop/actions/focus";
import { openNotificationInApp, resolveNotification } from "@aca/desktop/actions/notification";
import { snoozeNotification } from "@aca/desktop/actions/snooze";
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
