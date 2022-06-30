import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { userSlackInstallationEntity } from "@aca/desktop/clientdb/userSlackInstallation";
import { NotificationSlackMessageFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

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
    user_slack_installation_id
  }
`;

export const notificationSlackMessageEntity = defineEntity<NotificationSlackMessageFragment>({
  name: "notification_slack_message",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<NotificationSlackMessageFragment>(notificationSlackMessageFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationSlackMessageFragment>(notificationSlackMessageFragment),
}).addView((slackMessage, { db }) => {
  const getSlackInstallation = () => {
    const slackInstallationId = slackMessage.user_slack_installation_id;
    return slackInstallationId ? db.entity(userSlackInstallationEntity).findById(slackInstallationId) : null;
  };
  return {
    get slackInstallation() {
      return getSlackInstallation();
    },
    get slackTeamId() {
      return getSlackInstallation()?.team_id;
    },
    get workspaceName() {
      return getSlackInstallation()?.team_name;
    },
  };
});

export type NotificationSlackMessageEntity = EntityByDefinition<typeof notificationSlackMessageEntity>;
