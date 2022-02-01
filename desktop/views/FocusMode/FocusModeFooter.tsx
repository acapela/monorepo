import React from "react";

import {
  exitFocusMode,
  focusOnNotificationPreview,
  goToNextNotification,
  goToPreviousNotification,
  openNotificationInApp,
  resolveNotification,
} from "@aca/desktop/actions/focus";
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
        openNotificationInApp,
      ]}
    />
  );
}
