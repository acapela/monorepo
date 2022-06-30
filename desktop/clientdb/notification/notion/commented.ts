import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationNotionCommentedFragment,
  Notification_Notion_Commented_Bool_Exp,
  Notification_Notion_Commented_Constraint,
  Notification_Notion_Commented_Insert_Input,
  Notification_Notion_Commented_Set_Input,
} from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const notificationNotionCommented = gql`
  fragment NotificationNotionCommented on notification_notion_commented {
    id
    notification_notion_id
    discussion_id
    created_at
    updated_at
  }
`;

type NotificationNotionCommentedConstraints = {
  key: Notification_Notion_Commented_Constraint;
  insert: Notification_Notion_Commented_Insert_Input;
  update: Notification_Notion_Commented_Set_Input;
  where: Notification_Notion_Commented_Bool_Exp;
};

export const notificationNotionCommentedEntity = defineEntity<NotificationNotionCommentedFragment>({
  name: "notification_notion_commented",
  updatedAtField: "updated_at",
  uniqueProps: ["notification_notion_id"],
  idField: "id",
  keys: getFragmentKeys<NotificationNotionCommentedFragment>(notificationNotionCommented),
  getDefaultValues: () => ({
    __typename: "notification_notion_commented",
    discussion_id: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationNotionCommentedFragment, NotificationNotionCommentedConstraints>(
    notificationNotionCommented,
    {
      insertColumns: ["id", "notification_notion_id", "created_at", "updated_at", "discussion_id"],
      updateColumns: ["updated_at"],
      upsertConstraint: "notification_notion_commented_pkey",
    }
  ),
});

export type NotificationNotionCommentedEntity = EntityByDefinition<typeof notificationNotionCommentedEntity>;
