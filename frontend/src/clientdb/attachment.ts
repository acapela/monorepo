import gql from "graphql-tag";
import { defineEntity } from "~clientdb";
import { AttachmentFragment, UpdatedAttachmentsQuery, UpdatedAttachmentsQueryVariables } from "~frontend/../../gql";
import { createQuery } from "~frontend/gql/utils";
import { clientdb } from ".";
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
      runSync({ lastSyncDate, updateItems }) {
        return subscribeToAttachmentUpdates({ lastSyncDate: lastSyncDate?.toISOString() ?? null }, (newData) => {
          updateItems(newData.attachment);
        });
      },
    },
  },
  (attachment) => {
    return {
      get message() {
        if (!attachment.message_id) return;

        return clientdb.message.findById(attachment.message_id);
      },
    };
  }
);
