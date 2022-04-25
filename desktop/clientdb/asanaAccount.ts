import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { AsanaAccountFragment } from "@aca/gql";

const asanaAccountFragment = gql`
  fragment AsanaAccount on asana_account {
    id
    user_id
    created_at
    updated_at
  }
`;

export const asanaAccountEntity = defineEntity<AsanaAccountFragment>({
  name: "asana_account",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AsanaAccountFragment>(asanaAccountFragment),
  sync: createHasuraSyncSetupFromFragment<AsanaAccountFragment>(asanaAccountFragment),
});

export type AsanaAccountEntity = EntityByDefinition<typeof asanaAccountEntity>;
