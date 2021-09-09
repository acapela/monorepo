import gql from "graphql-tag";

import { EntityByDefinition } from "~frontend/../../clientdb/entity/entity";
import { AttachmentFragment, UpdatedAttachmentsQuery, UpdatedAttachmentsQueryVariables } from "~frontend/../../gql";
import { defineEntity } from "~clientdb";
import { renderedApolloClientPromise } from "~frontend/apollo/client";
import { createQuery } from "~frontend/gql/utils";

import { messageEntity } from "./message";

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

export const attachmentEntity = defineEntity<AttachmentFragment>({
  name: "attachment",
  updatedAtField: "updated_at",
  keyField: "id",
  sync: {
    initPromise: () => renderedApolloClientPromise,
    pull({ lastSyncDate, updateItems }) {
      return subscribeToAttachmentUpdates({ lastSyncDate: lastSyncDate.toISOString() }, (newData) => {
        updateItems(newData.attachment);
      });
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
