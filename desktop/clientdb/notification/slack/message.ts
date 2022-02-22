import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { userSlackInstallationEntity } from "@aca/desktop/clientdb/userSlackInstallation";
import { NotificationSlackMessageFragment } from "@aca/gql";

const notificationSlackMessageFragment = gql`
  fragment NotificationSlackMessage on notification_slack_message {
    id
    notification_id
    created_at
    updated_at
    is_mention
    slack_conversation_id
    slack_user_id
    slack_message_ts
    slack_thread_ts
    conversation_name
    conversation_type
  }
`;

export const notificationSlackMessageEntity = defineEntity<NotificationSlackMessageFragment>({
  name: "notification_slack_message",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationSlackMessageFragment>(notificationSlackMessageFragment),
  getDefaultValues: () => ({
    __typename: "notification_slack_message",
    slack_message_ts: null,
    slack_thread_ts: null,
    slack_user_id: null,
    conversation_type: null,
    ...getGenericDefaultData(),
  }),
  sync: createHasuraSyncSetupFromFragment<NotificationSlackMessageFragment>(notificationSlackMessageFragment),
}).addConnections((slackMessage, { getEntity }) => {
  return {
    get slackTeamId() {
      return getEntity(userSlackInstallationEntity).all[0].slack_team_id;
    },
  };
});

export type NotificationSlackMessageEntity = EntityByDefinition<typeof notificationSlackMessageEntity>;
