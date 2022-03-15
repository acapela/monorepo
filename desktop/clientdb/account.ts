import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { AccountFragment } from "@aca/gql";

const accountFragment = gql`
  fragment Account on account {
    id
    updated_at
    created_at
    provider_id
  }
`;

export const accountEntity = defineEntity<AccountFragment>({
  name: "account",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AccountFragment>(accountFragment),
  sync: createHasuraSyncSetupFromFragment<AccountFragment>(accountFragment),
});

export type AccountEntity = EntityByDefinition<typeof accountEntity>;
