import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationNotionUserMentionedFragment,
  Notification_Notion_User_Mentioned_Bool_Exp,
  Notification_Notion_User_Mentioned_Constraint,
  Notification_Notion_User_Mentioned_Insert_Input,
  Notification_Notion_User_Mentioned_Set_Input,
} from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const notificationNotionUserMentioned = gql`
  fragment NotificationNotionUserMentioned on notification_notion_user_mentioned {
    id
    notification_notion_id
    created_at
    updated_at
  }
`;

type NotificationNotionUserMentionedConstraints = {
  key: Notification_Notion_User_Mentioned_Constraint;
  insert: Notification_Notion_User_Mentioned_Insert_Input;
  update: Notification_Notion_User_Mentioned_Set_Input;
  where: Notification_Notion_User_Mentioned_Bool_Exp;
};

export const notificationNotionUserMentionedEntity = defineEntity<NotificationNotionUserMentionedFragment>({
  name: "notification_notion_user_mentioned",
  updatedAtField: "updated_at",
  uniqueProps: ["notification_notion_id"],
  idField: "id",
  keys: getFragmentKeys<NotificationNotionUserMentionedFragment>(notificationNotionUserMentioned),
  getDefaultValues: () => ({
    __typename: "notification_notion_user_mentioned",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<
    NotificationNotionUserMentionedFragment,
    NotificationNotionUserMentionedConstraints
  >(notificationNotionUserMentioned, {
    insertColumns: ["id", "notification_notion_id", "created_at", "updated_at"],
    updateColumns: ["updated_at"],
    upsertConstraint: "notification_notion_user_mentioned_pkey",
  }),
});

export type NotificationNotionUserMentionedEntity = EntityByDefinition<typeof notificationNotionUserMentionedEntity>;
