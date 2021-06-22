import { gql } from "@apollo/client";
import {
  AttachmentDetailedInfoFragment as AttachmentDetailedInfoFragmentType,
  AttachmentQuery,
  AttachmentQueryVariables,
  DownloadUrlQuery,
  DownloadUrlQueryVariables,
  RemoveMessageAttachmentMutation,
  RemoveMessageAttachmentMutationVariables,
  AddMessageAttachmentMutation,
  AddMessageAttachmentMutationVariables,
  UploadUrlQuery,
  UploadUrlQueryVariables,
} from "~gql";
import { MessageDetailedInfoFragment } from "./messages";
import { createFragment, createMutation, createQuery } from "./utils";

export const AttachmentDetailedInfoFragment = createFragment<AttachmentDetailedInfoFragmentType>(
  () => gql`
    fragment AttachmentDetailedInfo on attachment {
      id
      originalName: original_name
      mimeType: mime_type
      message_attachments {
        message {
          user_id
        }
      }
    }
  `
);

export const [useAddMessageAttachment, { mutate: addMessageAttachment }] = createMutation<
  AddMessageAttachmentMutation,
  AddMessageAttachmentMutationVariables
>(
  () => gql`
    mutation AddMessageAttachment($attachmentId: uuid!, $messageId: uuid!) {
      insert_message_attachment_one(object: { attachment_id: $attachmentId, message_id: $messageId }) {
        attachment_id
        message_id
      }
    }
  `
);

export const [useRemoveMessageAttachment, { mutate: removeMessageAttachment }] = createMutation<
  RemoveMessageAttachmentMutation,
  RemoveMessageAttachmentMutationVariables
>(
  () => gql`
    mutation RemoveMessageAttachment($attachmentId: uuid!, $messageId: uuid!) {
      delete_message_attachment_by_pk(attachment_id: $attachmentId, message_id: $messageId) {
        attachment_id
        message_id
      }
    }
  `,
  {
    optimisticResponse(variables) {
      return {
        __typename: "mutation_root",
        delete_message_attachment_by_pk: {
          __typename: "message_attachment",
          attachment_id: variables.attachmentId,
          message_id: variables.messageId,
        },
      };
    },
    onResult(message, variables) {
      MessageDetailedInfoFragment.update(variables.messageId, (message) => {
        message.message_attachments = message.message_attachments.filter((messageAttachment) => {
          return messageAttachment.attachment.id !== variables.attachmentId;
        });
      });
    },
  }
);

export const [useUploadUrlQuery, uploadUrlQueryManager] = createQuery<UploadUrlQuery, UploadUrlQueryVariables>(
  () => gql`
    query UploadUrl($fileName: String!, $mimeType: String!) {
      uploadUrlInfo: get_upload_url(fileName: $fileName, mimeType: $mimeType) {
        uploadUrl
        uuid
      }
    }
  `
);

export const [useDownloadUrlQuery] = createQuery<DownloadUrlQuery, DownloadUrlQueryVariables>(
  () => gql`
    query DownloadUrl($id: uuid!) {
      get_download_url(uuid: $id) {
        downloadUrl
      }
    }
  `
);

export const [useAttachmentQuery] = createQuery<AttachmentQuery, AttachmentQueryVariables>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}
    query Attachment($id: uuid!) {
      attachment: attachment_by_pk(id: $id) {
        ...AttachmentDetailedInfo
      }
    }
  `
);
