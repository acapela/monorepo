import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationJiraFragment } from "@aca/gql";

const notificationJiraIssueFragment = gql`
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

export const notificationJiraIssueEntity = defineEntity<NotificationJiraFragment>({
  name: "notification_jira",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<NotificationJiraFragment>(notificationJiraIssueFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationJiraFragment>(notificationJiraIssueFragment),
});

export type NotificationJiraIssueEntity = EntityByDefinition<typeof notificationJiraIssueEntity>;
