import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { GitHubInstallationFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

const githubInstallationFragment = gql`
  fragment GitHubInstallation on github_installation {
    id
    installation_id
    account_id
    account_login
    target_type
    repository_selection
    created_at
    updated_at
  }
`;

export const githubInstallationEntity = defineEntity<GitHubInstallationFragment>({
  name: "github_installation",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<GitHubInstallationFragment>(githubInstallationFragment),
  sync: createHasuraSyncSetupFromFragment<GitHubInstallationFragment>(githubInstallationFragment),
});

export type GitHubInstallationEntity = EntityByDefinition<typeof githubInstallationEntity>;
