import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { notificationEntity } from "@aca/desktop/clientdb/notification";
import {
  NotificationNotionFragment,
  Notification_Notion_Bool_Exp,
  Notification_Notion_Constraint,
  Notification_Notion_Insert_Input,
  Notification_Notion_Set_Input,
} from "@aca/gql";
import { FindInput } from "@acapela/clientdb";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

import { notificationNotionCommentedEntity } from "./commented";
import { notionSpaceEntity } from "./notionSpace";
import { notificationNotionReminderEntity } from "./reminder";
import { notificationNotionUserInvitedEntity } from "./userInvited";
import { notificationNotionUserMentionedEntity } from "./userMentioned";

const notificationNotion = gql`
  fragment NotificationNotion on notification_notion {
    id
    notion_original_notification_id
    notification_id
    created_at
    updated_at
    page_id
    page_title
    space_id
    notion_space_id
    author_id
  }
`;

type NotificationNotionConstraints = {
  key: Notification_Notion_Constraint;
  insert: Notification_Notion_Insert_Input;
  update: Notification_Notion_Set_Input;
  where: Notification_Notion_Bool_Exp;
};

const notionInnerEntities = [
  notificationNotionUserMentionedEntity,
  notificationNotionCommentedEntity,
  notificationNotionUserInvitedEntity,
  notificationNotionReminderEntity,
];

export const notificationNotionEntity = defineEntity<NotificationNotionFragment>({
  name: "notification_notion",
  updatedAtField: "updated_at",
  uniqueProps: ["notification_id", "notion_original_notification_id"],
  idField: "id",
  keys: getFragmentKeys<NotificationNotionFragment>(notificationNotion),
  getDefaultValues: () => ({
    __typename: "notification_notion",
    // this shouldn't be null
    // but it's a side-effect of adding to an existing entity
    notion_space_id: null,
    space_id: null,
    author_id: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationNotionFragment, NotificationNotionConstraints>(
    notificationNotion,
    {
      insertColumns: [
        "id",
        "space_id",
        "notification_id",
        "notion_original_notification_id",
        "page_id",
        "created_at",
        "updated_at",
        "page_title",
        "author_id",
        "notion_space_id",
      ],
      updateColumns: ["updated_at", "page_title", "space_id"],
      upsertConstraint: "notification_notion_pkey",
    }
  ),
})
  .addView((notificationNotion, { db }) => {
    const connections = {
      get inner(): EntityByDefinition<typeof notionInnerEntities[number]> {
        for (const entity of notionInnerEntities) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const client = db.entity(entity as any);

          const foundInner = client.findFirst({ notification_notion_id: notificationNotion.id } as FindInput<
            unknown,
            unknown
          >);

          if (foundInner) {
            return foundInner as unknown as EntityByDefinition<typeof notionInnerEntities[number]>;
          }
        }

        return undefined as unknown as EntityByDefinition<typeof notionInnerEntities[number]>;
      },
      resolveData() {
        return {
          space_id:
            notificationNotion.space_id ||
            (notificationNotion.notion_space_id &&
              db.entity(notionSpaceEntity).findById(notificationNotion.notion_space_id)?.space_id),
          notion_original_notification_id: notificationNotion.notion_original_notification_id,
        };
      },
      get type() {
        return connections.inner.__typename;
      },
      get notification() {
        return db.entity(notificationEntity).findById(notificationNotion.notification_id);
      },
      get workspaceName() {
        if (!notificationNotion.notion_space_id) {
          return;
        }
        return db.entity(notionSpaceEntity).findById(notificationNotion.notion_space_id)!.name;
      },
    };

    return connections;
  })
  .addRootFilter((entity) => {
    if (!entity.inner) {
      console.warn(`No inner for entity`, entity);
      return false;
    }

    return true;
  });

export type NotificationNotionEntity = EntityByDefinition<typeof notificationNotionEntity>;
