import { observer } from "mobx-react";
import React from "react";

import {
  addReminderToNotification,
  cancelSaveNotification,
  resolveNotification,
  saveNotification,
} from "@aca/desktop/actions/notification";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { NotificationOrGroup } from "@aca/desktop/domains/group/groupNotifications";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

interface Props {
  notification: NotificationOrGroup;
}

export const FocusBarActiveItemActions = observer(({ notification }: Props) => {
  notification = getPrimaryNotification(notification);
  return (
    <>
      <TopBarActionButton action={resolveNotification} target={notification} />
      <TopBarActionButton action={addReminderToNotification} target={notification} />
      <TopBarActionButton action={saveNotification} notApplicableMode="hide" target={notification} />
      <TopBarActionButton action={cancelSaveNotification} notApplicableMode="hide" target={notification} />
    </>
  );
});
