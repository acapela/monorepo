import gql from "graphql-tag";

import { defineEntity } from "~clientdb";
import { EntityByDefinition } from "~clientdb/entity/entity";
import { createMutation, createQuery } from "~frontend/gql/utils";
import {
  AttachmentFragment,
  Attachment_Insert_Input,
  Attachment_Set_Input,
  PushUpdateAttachmentMutation,
  PushUpdateAttachmentMutationVariables,
  UpdatedAttachmentsQuery,
  UpdatedAttachmentsQueryVariables,
} from "~gql";

import { messageEntity } from "./message";
import { getFragmentKeys } from "./utils/getFragmentKeys";
import { getGenericDefaultData } from "./utils/getGenericDefaultData";

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

const [, { subscribe: subscribeToAttachmentUpdates }] = createQuery<
  UpdatedAttachmentsQuery,
  UpdatedAttachmentsQueryVariables
>(
  () => gql`
    ${attachmentFragment}

    query UpdatedAttachments($lastSyncDate: timestamptz) {
      attachment(where: { created_at: { _gt: $lastSyncDate } }) {
        ...Attachment
      }
    }
  `
);

const [, { mutate: updateAttachment }] = createMutation<
  PushUpdateAttachmentMutation,
  PushUpdateAttachmentMutationVariables
>(
  () => gql`
    ${attachmentFragment}
    mutation PushUpdateAttachment($input: attachment_insert_input!) {
      insert_attachment_one(
        object: $input
        on_conflict: { constraint: attachment_id_key, update_columns: [mime_type, original_name] }
      ) {
        ...Attachment
      }
    }
  `
);

function convertChangedDataToInput({
  id,
  message_id,
  mime_type,
  original_name,
}: Partial<AttachmentFragment>): Attachment_Insert_Input {
  return { id, message_id, mime_type, original_name };
}

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
  sync: {
    pullUpdated({ lastSyncDate, updateItems }) {
      return subscribeToAttachmentUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.attachment);
      });
    },
    async push(task) {
      const result = await updateAttachment({ input: convertChangedDataToInput(task) });

      return result[0] ?? false;
    },
  },
}).addConnections((attachment, { getEntity }) => {
  return {
    get message() {
      if (!attachment.message_id) return;

      return getEntity(messageEntity).findById(attachment.message_id);
    },
  };
});

export type AttachmentEntity = EntityByDefinition<typeof attachmentEntity>;
