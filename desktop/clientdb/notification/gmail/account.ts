import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { GmailAccountFragment } from "@aca/gql";

const gmailAccountFragment = gql`
  fragment GmailAccount on gmail_account {
    id
    created_at
    updated_at
  }
`;

export const gmailAccountEntity = defineEntity<GmailAccountFragment>({
  name: "gmail_account",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<GmailAccountFragment>(gmailAccountFragment),
  sync: createHasuraSyncSetupFromFragment<GmailAccountFragment>(gmailAccountFragment),
});

export type GmailAccountEntity = EntityByDefinition<typeof gmailAccountEntity>;
