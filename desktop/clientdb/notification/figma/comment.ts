import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { notificationEntity } from "@aca/desktop/clientdb/notification";
import {
  NotificationFigmaCommentFragment,
  Notification_Figma_Comment_Bool_Exp,
  Notification_Figma_Comment_Constraint,
  Notification_Figma_Comment_Insert_Input,
  Notification_Figma_Comment_Set_Input,
} from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

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
    author_id
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
  uniqueProps: ["notification_id", "figma_notification_id"],
  idField: "id",
  keys: getFragmentKeys<NotificationFigmaCommentFragment>(notificationFigmaComment),
  getDefaultValues: () => ({
    __typename: "notification_figma_comment",
    thread_comment_id: null,
    author_id: null,
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
        "author_id",
      ],
      updateColumns: ["updated_at", "file_name"],
      upsertConstraint: "notification_figma_comment_pkey",
    }
  ),
}).addView((figmaComment, { db }) => ({
  get notification() {
    return db.entity(notificationEntity).findById(figmaComment.notification_id);
  },
}));

export type NotificationFigmaCommentEntity = EntityByDefinition<typeof notificationFigmaCommentEntity>;
