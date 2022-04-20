import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { AsanaWebhookFragment } from "@aca/gql";

const asanaAccountFragment = gql`
  fragment AsanaWebhook on asana_webhook {
    id
    project_id
    project_name
    workspace_id
    workspace_name
    created_at
    updated_at
    asana_account_id
  }
`;

export const asanaWebhookEntity = defineEntity<AsanaWebhookFragment>({
  name: "asana_webhook",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AsanaWebhookFragment>(asanaAccountFragment),
  sync: createHasuraSyncSetupFromFragment<AsanaWebhookFragment>(asanaAccountFragment),
});

export type AsanaWebhookEntity = EntityByDefinition<typeof asanaWebhookEntity>;
