import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { AccountFragment } from "@aca/gql";
import { EntityByDefinition, defineEntity } from "@acapela/clientdb";

const accountFragment = gql`
  fragment Account on account {
    id
    email
    updated_at
    created_at
    provider_id
  }
`;

export const accountEntity = defineEntity<AccountFragment>({
  name: "account",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<AccountFragment>(accountFragment),
  sync: createHasuraSyncSetupFromFragment<AccountFragment>(accountFragment),
});

export type AccountEntity = EntityByDefinition<typeof accountEntity>;
