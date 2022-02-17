import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationFigmaCommentFragment,
  Notification_Figma_Comment_Bool_Exp,
  Notification_Figma_Comment_Constraint,
  Notification_Figma_Comment_Insert_Input,
  Notification_Figma_Comment_Set_Input,
} from "@aca/gql";

const notificationFigmaComment = gql`
  fragment NotificationFigmaComment on notification_figma_comment {
    id
    notification_id
    created_at
    updated_at
    file_id
    file_name
    is_mention
    figma_notification_id
    thread_comment_id
  }
`;

type NotificationFigmaCommentConstraints = {
  key: Notification_Figma_Comment_Constraint;
  insert: Notification_Figma_Comment_Insert_Input;
  update: Notification_Figma_Comment_Set_Input;
  where: Notification_Figma_Comment_Bool_Exp;
};

export const notificationFigmaCommentEntity = defineEntity<NotificationFigmaCommentFragment>({
  name: "notification_figma_comment",
  updatedAtField: "updated_at",
  uniqueIndexes: ["notification_id", "figma_notification_id"],
  keyField: "id",
  keys: getFragmentKeys<NotificationFigmaCommentFragment>(notificationFigmaComment),
  getDefaultValues: () => ({
    __typename: "notification_figma_comment",
    thread_comment_id: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationFigmaCommentFragment, NotificationFigmaCommentConstraints>(
    notificationFigmaComment,
    {
      insertColumns: [
        "id",
        "notification_id",
        "file_id",
        "created_at",
        "updated_at",
        "file_name",
        "is_mention",
        "figma_notification_id",
        "thread_comment_id",
      ],
      updateColumns: ["updated_at", "file_name"],
      upsertConstraint: "notification_figma_comment_pkey",
    }
  ),
});

export type NotificationFigmaCommentEntity = EntityByDefinition<typeof notificationFigmaCommentEntity>;
