import gql from "graphql-tag";

import { EntityByDefinition, defineEntity } from "@aca/clientdb";
import { createHasuraSyncSetupFromFragment } from "@aca/clientdb/sync";
import { getFragmentKeys } from "@aca/clientdb/utils/analyzeFragment";
import { getGenericDefaultData } from "@aca/clientdb/utils/getGenericDefaultData";
import { transcriptionEntity } from "@aca/frontend/clientdb/transcription";
import {
  AttachmentFragment,
  Attachment_Bool_Exp,
  Attachment_Constraint,
  Attachment_Insert_Input,
  Attachment_Set_Input,
} from "@aca/gql";

import { messageEntity } from "./message";

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

type AttachmentConstraints = {
  key: Attachment_Constraint;
  insert: Attachment_Insert_Input;
  update: Attachment_Set_Input;
  where: Attachment_Bool_Exp;
};

export const attachmentEntity = defineEntity<AttachmentFragment>({
  name: "attachment",
  updatedAtField: "updated_at",
  keyField: "id",
  keys: getFragmentKeys<AttachmentFragment>(attachmentFragment),
  getDefaultValues() {
    return {
      __typename: "attachment",
      message_id: null,
      transcription_id: null,
      ...getGenericDefaultData(),
    };
  },
  sync: createHasuraSyncSetupFromFragment<AttachmentFragment, AttachmentConstraints>(attachmentFragment, {
    insertColumns: ["id", "message_id", "mime_type", "original_name"],
    updateColumns: ["message_id"],
    upsertConstraint: "attachment_id_key",
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
