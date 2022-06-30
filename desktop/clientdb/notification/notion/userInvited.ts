import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationNotionUserInvitedFragment,
  Notification_Notion_User_Invited_Bool_Exp,
  Notification_Notion_User_Invited_Constraint,
  Notification_Notion_User_Invited_Insert_Input,
  Notification_Notion_User_Invited_Set_Input,
} from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const notificationNotionUserInvited = gql`
  fragment NotificationNotionUserInvited on notification_notion_user_invited {
    id
    notification_notion_id
    created_at
    updated_at
  }
`;

type NotificationNotionUserInvitedConstraints = {
  key: Notification_Notion_User_Invited_Constraint;
  insert: Notification_Notion_User_Invited_Insert_Input;
  update: Notification_Notion_User_Invited_Set_Input;
  where: Notification_Notion_User_Invited_Bool_Exp;
};

export const notificationNotionUserInvitedEntity = defineEntity<NotificationNotionUserInvitedFragment>({
  name: "notification_notion_user_invited",
  updatedAtField: "updated_at",
  uniqueProps: ["notification_notion_id"],
  idField: "id",
  keys: getFragmentKeys<NotificationNotionUserInvitedFragment>(notificationNotionUserInvited),
  getDefaultValues: () => ({
    __typename: "notification_notion_user_invited",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<
    NotificationNotionUserInvitedFragment,
    NotificationNotionUserInvitedConstraints
  >(notificationNotionUserInvited, {
    insertColumns: ["id", "notification_notion_id", "created_at", "updated_at"],
    updateColumns: ["updated_at"],
    upsertConstraint: "notification_notion_user_invited_pkey",
  }),
});

export type NotificationNotionUserInvitedEntity = EntityByDefinition<typeof notificationNotionUserInvitedEntity>;
