import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { NotificationGitHubFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

const notificationGitHubFragment = gql`
  fragment NotificationGitHub on notification_github {
    id
    notification_id
    created_at
    updated_at
    type
    issue_id
    title
    repository_id
    repository_full_name
    pr_id
  }
`;

export const notificationGitHubEntity = defineEntity<NotificationGitHubFragment>({
  name: "notification_github",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<NotificationGitHubFragment>(notificationGitHubFragment),
  sync: createHasuraSyncSetupFromFragment<NotificationGitHubFragment>(notificationGitHubFragment),
});

export type NotificationGitHubEntity = EntityByDefinition<typeof notificationGitHubEntity>;
