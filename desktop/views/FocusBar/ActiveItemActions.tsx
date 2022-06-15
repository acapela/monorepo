import { observer } from "mobx-react";
import React from "react";

import {
  addReminderToNotification,
  cancelSaveNotification,
  resolveNotification,
  saveNotification,
} from "@aca/desktop/actions/notification";
import { NotificationEntity } from "@aca/desktop/clientdb/notification";
import { getPrimaryNotification } from "@aca/desktop/domains/group/group";
import { TopBarActionButton } from "@aca/desktop/ui/systemTopBar/TopBarActionButton";

interface Props {
  notification: NotificationEntity;
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
