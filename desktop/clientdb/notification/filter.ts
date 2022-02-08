import * as Sentry from "@sentry/electron";
import gql from "graphql-tag";
import { z } from "zod";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userIdContext } from "@aca/clientdb/utils/context";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import {
  NotificationFilterFragment,
  Notification_Filter_Bool_Exp,
  Notification_Filter_Constraint,
  Notification_Filter_Insert_Input,
  Notification_Filter_Set_Input,
} from "@aca/gql";
import { isNotNullish } from "@aca/shared/nullish";

/**
 * Defines all properties per inner notification entity which can be filtered for. Since we store filters as blobs
 * we use zod to parse the blob data.
 * Any non-additive change requires migration, make sure to include a SQL migration for these. Non-parseable filters
 * won't be applied and will show up as error logs in our Sentry.
 */
export const innerNotificationFilter = z.union([
  z.object({
    kind: z.literal("notification_slack_message"),
    slack_user_id: z.string().optional(),
    is_mention: z.boolean().optional(),
    conversation_type: z
      .union([z.literal("im"), z.literal("mpim"), z.literal("group"), z.literal("channel")])
      .optional(),
  }),
  z.object({
    kind: z.literal("notification_notion"),
    page_id: z.string().optional(),
  }),
]);
export type InnerNotificationFilter = z.infer<typeof innerNotificationFilter>;

const notificationFragment = gql`
  fragment NotificationFilter on notification_filter {
    id
    updated_at
    created_at
    title
    data
  }
`;

type NotificationFilterConstraints = {
  key: Notification_Filter_Constraint;
  insert: Notification_Filter_Insert_Input;
  update: Notification_Filter_Set_Input;
  where: Notification_Filter_Bool_Exp;
};

export const notificationFilterEntity = defineEntity<NotificationFilterFragment>({
  name: "notification_filter",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationFilterFragment>(notificationFragment),
  getDefaultValues: ({ getContextValue }) => ({
    __typename: "notification_filter",
    user_id: getContextValue(userIdContext) ?? undefined,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationFilterFragment, NotificationFilterConstraints>(
    notificationFragment,
    {
      insertColumns: ["id", "created_at", "updated_at", "user_id", "title", "data"],
      updateColumns: ["updated_at", "title", "data"],
      upsertConstraint: "notification_filter_pkey",
    }
  ),
}).addConnections((notificationFilter) => ({
  get filters() {
    if (!Array.isArray(notificationFilter.data)) {
      Sentry.captureException(
        new Error(
          `Non-array in notification filter ${notificationFilter.id}: ${JSON.stringify(notificationFilter.data)}`
        )
      );
      return [];
    }
    return notificationFilter.data
      .map((dataRow, i) => {
        const result = innerNotificationFilter.safeParse(dataRow);
        if (!result.success) {
          Sentry.captureException(
            new Error(
              `Parsing error for notification filter ${notificationFilter.id} in item ${i} with data ${JSON.stringify(
                dataRow
              )}: ${result.error.message}`
            )
          );
          return;
        }
        return result.data;
      })
      .filter(isNotNullish);
  },
}));

export type NotificationFilterEntity = EntityByDefinition<typeof notificationFilterEntity>;
