import gql from "graphql-tag";

import { defineEntity } from "@aca/clientdb";
import { EntityByDefinition } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { accountEntity } from "@aca/desktop/clientdb/account";
import { GmailAccountFragment } from "@aca/gql";

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
  keyField: "id",
  keys: getFragmentKeys<GmailAccountFragment>(gmailAccountFragment),
  sync: createHasuraSyncSetupFromFragment<GmailAccountFragment>(gmailAccountFragment),
}).addConnections((gmailAccount, { getEntity }) => ({
  get account() {
    return getEntity(accountEntity).findById(gmailAccount.account_id);
  },
}));

export type GmailAccountEntity = EntityByDefinition<typeof gmailAccountEntity>;
