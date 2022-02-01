import React from "react";

import { openFocusMode, openNotificationInApp, resolveNotification } from "@aca/desktop/actions/focus";
import {
  focusNextNotificationInList,
  focusPreviousNotificationInList,
  goToNextList,
  goToPreviousList,
} from "@aca/desktop/actions/lists";
import { ShortcutsFooter } from "@aca/desktop/ui/ShortcutsFooter";

export function ListViewFooter() {
  return (
    <ShortcutsFooter
      actions={[
        focusNextNotificationInList,
        focusPreviousNotificationInList,
        goToNextList,
        goToPreviousList,
        openFocusMode,
        resolveNotification,
        openNotificationInApp,
      ]}
    />
  );
}
