import React from "react";

import { toggleNotificationsGroup } from "@aca/desktop/actions/group";
import { focusNextNotificationInList, focusPreviousNotificationInList } from "@aca/desktop/actions/lists";
import {
  addReminderToNotification,
  openFocusMode,
  openNotificationInApp,
  removeNotificationReminder,
  resolveNotification,
  unresolveNotification,
} from "@aca/desktop/actions/notification";
import { ShortcutsFooter } from "@aca/desktop/ui/ShortcutsFooter";

export function ListViewFooter() {
  return (
    <ShortcutsFooter
      actions={[
        focusNextNotificationInList,
        focusPreviousNotificationInList,
        toggleNotificationsGroup,
        openFocusMode,
        resolveNotification,
        addReminderToNotification,
        openNotificationInApp,
        unresolveNotification,
        removeNotificationReminder,
      ]}
    />
  );
}
