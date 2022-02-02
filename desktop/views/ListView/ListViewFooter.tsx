import React from "react";

import { openFocusMode } from "@aca/desktop/actions/focus";
import {
  focusNextNotificationInList,
  focusPreviousNotificationInList,
  goToNextList,
  goToPreviousList,
  toggleNotificationsGroup,
} from "@aca/desktop/actions/lists";
import { openNotificationInApp, resolveNotification } from "@aca/desktop/actions/notification";
import { ShortcutsFooter } from "@aca/desktop/ui/ShortcutsFooter";

export function ListViewFooter() {
  return (
    <ShortcutsFooter
      actions={[
        focusNextNotificationInList,
        focusPreviousNotificationInList,
        goToPreviousList,
        goToNextList,
        openFocusMode,
        resolveNotification,
        openNotificationInApp,
        toggleNotificationsGroup,
      ]}
    />
  );
}
