import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { AttachmentFragment } from "~gql";

import { messageEntity } from "./message";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const attachmentFragment = gql`
  fragment Attachment on attachment {
    id
    created_at
    mime_type
    original_name
    message_id
    updated_at
  }
`;

export const attachmentEntity = defineEntity<AttachmentFragment>({
  name: "attachment",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AttachmentFragment>(attachmentFragment),
  getDefaultValues() {
    return {
      __typename: "attachment",
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<AttachmentFragment>(attachmentFragment, {
    upsertIdKey: "attachment_id_key",
    insertColumns: ["id", "message_id", "mime_type", "original_name"],
    updateColumns: [],
  }),
}).addConnections((attachment, { getEntity }) => {
  return {
    get message() {
      if (!attachment.message_id) return;

      return getEntity(messageEntity).findById(attachment.message_id);
    },
  };
});

export type AttachmentEntity = EntityByDefinition<typeof attachmentEntity>;
