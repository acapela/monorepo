import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationJiraFragment } from "@aca/gql";

const notificationJiraFragment = gql`
  fragment NotificationJira on notification_jira_issue {
    id
    notification_id
    created_at
    updated_at
    type
    issue_id
    issue_title
  }
`;

export const notificationJiraEntity = defineEntity<NotificationJiraFragment>({
  name: "notification_jira",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationJiraFragment>(notificationJiraFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationJiraFragment>(notificationJiraFragment),
});

export type NotificationJiraEntity = EntityByDefinition<typeof notificationJiraEntity>;
