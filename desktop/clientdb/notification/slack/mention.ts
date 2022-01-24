import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { NotificationSlackMentionFragment } from "@aca/gql";

const notificationSlackMentionFragment = gql`
  fragment NotificationSlackMention on notification_slack_mention {
    id
    notification_id
    created_at
    updated_at
    slack_conversation_id
    slack_message_ts
  }
`;

export const notificationSlackMentionEntity = defineEntity<NotificationSlackMentionFragment>({
  name: "notification_slack_mention",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationSlackMentionFragment>(notificationSlackMentionFragment),
  getDefaultValues: () => ({
    __typename: "notification_slack_mention",
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationSlackMentionFragment>(notificationSlackMentionFragment),
});

export type NotificationSlackMentionEntity = EntityByDefinition<typeof notificationSlackMentionEntity>;
