import React from "react";

import {
  focusNextNotificationInList,
  focusPreviousNotificationInList,
  goToNextList,
  goToPreviousList,
  toggleNotificationsGroup,
} from "@aca/desktop/actions/lists";
import { openFocusMode, openNotificationInApp, resolveNotification } from "@aca/desktop/actions/notification";
import { snoozeNotification } from "@aca/desktop/actions/snooze";
import { ShortcutsFooter } from "@aca/desktop/ui/ShortcutsFooter";

export function ListViewFooter() {
  return (
    <ShortcutsFooter
      actions={[
        goToPreviousList,
        goToNextList,
        focusNextNotificationInList,
        focusPreviousNotificationInList,
        toggleNotificationsGroup,
        openFocusMode,
        resolveNotification,
        snoozeNotification,
        openNotificationInApp,
      ]}
    />
  );
}
