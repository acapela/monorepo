import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { AttachmentFragment, UpdatedAttachmentsQuery, UpdatedAttachmentsQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
import { messageEntity } from "./message";
import { userEntity } from "./user";

const attachmentFragment = gql`
  fragment Attachment on attachment {
    id
    created_at
    mime_type
    message_id
  }
`;

const [, { subscribe: subscribeToAttachmentUpdates }] = createQuery<
  UpdatedAttachmentsQuery,
  UpdatedAttachmentsQueryVariables
>(
  () => gql`
    ${attachmentFragment}

    query UpdatedAttachments($lastSyncDate: timestamptz) {
      attachment(where: { created_at: { _gte: $lastSyncDate } }) {
        ...Attachment
      }
    }
  `,
  {}
);

export const attachmentEntity = defineEntity<AttachmentFragment>(
  {
    name: "attachment",
    getCacheKey: (space) => space.id,
    sync: {
      pull({ lastSyncDate, updateItems }) {
        return subscribeToAttachmentUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.attachment);
        });
      },
    },
  },
  (attachment, { getEntity }) => {
    return {
      get message() {
        if (!attachment.message_id) return;

        return getEntity(messageEntity).findById(attachment.message_id);
      },
    };
  }
);
