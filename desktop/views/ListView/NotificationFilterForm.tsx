import { observer } from "mobx-react";
import React from "react";

import { getDb } from "@aca/desktop/clientdb";
import { InnerNotificationFilter } from "@aca/desktop/clientdb/notification/filter";
import { Toggle } from "@aca/ui/toggle";

export const NotificationFilterForm = observer(({ listId }: { listId: string }) => {
  const notificationFilter = getDb().notificationFilter.assertFindById(listId);
  return (
    <div>
      <Toggle
        isSet={notificationFilter.filters.some(
          (filter) => filter.kind === "notification_slack_message" && filter.is_mention
        )}
        onChange={(isSet) => {
          notificationFilter.update({
            data: isSet ? [{ kind: "notification_slack_message", is_mention: true } as InnerNotificationFilter] : [],
          });
        }}
      />{" "}
      Slack mentions
    </div>
  );
});
