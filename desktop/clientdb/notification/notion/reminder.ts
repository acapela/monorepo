import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationNotionReminderFragment,
  Notification_Notion_Reminder_Bool_Exp,
  Notification_Notion_Reminder_Constraint,
  Notification_Notion_Reminder_Insert_Input,
  Notification_Notion_Reminder_Set_Input,
} from "@aca/gql";

const notificationNotionReminder = gql`
  fragment NotificationNotionReminder on notification_notion_reminder {
    id
    notification_notion_id
    created_at
    updated_at
  }
`;

type NotificationNotionReminderConstraints = {
  key: Notification_Notion_Reminder_Constraint;
  insert: Notification_Notion_Reminder_Insert_Input;
  update: Notification_Notion_Reminder_Set_Input;
  where: Notification_Notion_Reminder_Bool_Exp;
};

export const notificationNotionReminderEntity = defineEntity<NotificationNotionReminderFragment>({
  name: "notification_notion_reminder",
  updatedAtField: "updated_at",
  uniqueIndexes: ["notification_notion_id"],
  keyField: "id",
  keys: getFragmentKeys<NotificationNotionReminderFragment>(notificationNotionReminder),
  getDefaultValues: () => ({
    __typename: "notification_notion_reminder",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationNotionReminderFragment, NotificationNotionReminderConstraints>(
    notificationNotionReminder,
    {
      insertColumns: ["id", "notification_notion_id", "created_at", "updated_at"],
      updateColumns: ["updated_at"],
      upsertConstraint: "notification_notion_reminder_pkey",
    }
  ),
});

export type NotificationNotionReminderEntity = EntityByDefinition<typeof notificationNotionReminderEntity>;
