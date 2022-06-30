import gql from "graphql-tag";

import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { accountEntity } from "@aca/desktop/clientdb/account";
import { GmailAccountFragment } from "@aca/gql";
import { defineEntity } from "@acapela/clientdb";
import { EntityByDefinition } from "@acapela/clientdb";

const gmailAccountFragment = gql`
  fragment GmailAccount on gmail_account {
    id
    account_id
    created_at
    updated_at
  }
`;

export const gmailAccountEntity = defineEntity<GmailAccountFragment>({
  name: "gmail_account",
  updatedAtField: "updated_at",
  idField: "id",
  keys: getFragmentKeys<GmailAccountFragment>(gmailAccountFragment),
  sync: createHasuraSyncSetupFromFragment<GmailAccountFragment>(gmailAccountFragment),
}).addView((gmailAccount, { db }) => ({
  get account() {
    return db.entity(accountEntity).findById(gmailAccount.account_id);
  },
}));

export type GmailAccountEntity = EntityByDefinition<typeof gmailAccountEntity>;
