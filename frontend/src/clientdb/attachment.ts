import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { transcriptionEntity } from "@aca/frontend/clientdb/transcription";
import { AttachmentFragment } from "@aca/gql";

import { messageEntity } from "./message";
import { getFragmentKeys } from "./utils/analyzeFragment";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";
import { createHasuraSyncSetupFromFragment } from "./utils/sync";

const attachmentFragment = gql`
  fragment Attachment on attachment {
    id
    created_at
    mime_type
    original_name
    transcription_id
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
    insertColumns: ["id", "message_id", "mime_type", "original_name"],
    updateColumns: ["message_id"],
  }),
}).addConnections((attachment, { getEntity }) => ({
  get message() {
    if (!attachment.message_id) return;

    return getEntity(messageEntity).findById(attachment.message_id);
  },
  get transcription() {
    return attachment.transcription_id ? getEntity(transcriptionEntity).findById(attachment.transcription_id) : null;
  },
}));

export type AttachmentEntity = EntityByDefinition<typeof attachmentEntity>;
