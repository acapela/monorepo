import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationNotionFragment,
  Notification_Notion_Bool_Exp,
  Notification_Notion_Constraint,
  Notification_Notion_Insert_Input,
  Notification_Notion_Set_Input,
} from "@aca/gql";

const notificationNotion = gql`
  fragment NotificationNotion on notification_notion {
    id
    notion_original_notification_id
    notification_id
    created_at
    updated_at
    page_id
    page_title
  }
`;

type NotificationNotionConstraints = {
  key: Notification_Notion_Constraint;
  insert: Notification_Notion_Insert_Input;
  update: Notification_Notion_Set_Input;
  where: Notification_Notion_Bool_Exp;
};

export const notificationNotionEntity = defineEntity<NotificationNotionFragment>({
  name: "notification_notion",
  updatedAtField: "updated_at",
  uniqueIndexes: ["notification_id", "notion_original_notification_id"],
  keyField: "id",
  keys: getFragmentKeys<NotificationNotionFragment>(notificationNotion),
  getDefaultValues: () => ({
    __typename: "notification_notion",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationNotionFragment, NotificationNotionConstraints>(
    notificationNotion,
    {
      insertColumns: [
        "id",
        "notification_id",
        "notion_original_notification_id",
        "page_id",
        "created_at",
        "updated_at",
        "page_title",
      ],
      updateColumns: ["updated_at", "page_title"],
      upsertConstraint: "notification_notion_pkey",
    }
  ),
});

export type NotificationNotionEntity = EntityByDefinition<typeof notificationNotionEntity>;
