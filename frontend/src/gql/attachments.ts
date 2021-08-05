import { gql } from "@apollo/client";
import { assert } from "~shared/assert";
import {
  AttachmentDetailedInfoFragment as AttachmentDetailedInfoFragmentType,
  AttachmentQuery,
  AttachmentQueryVariables,
  DownloadUrlQuery,
  DownloadUrlQueryVariables,
  RemoveAttachmentMutation,
  RemoveAttachmentMutationVariables,
  UpdateAttachmentMutation,
  UpdateAttachmentMutationVariables,
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
      message {
        id
        user_id
      }
      transcription {
        status
        transcript
      }
    }
  `
);

export const [useUpdateAttachment, { mutate: updateAttachment }] = createMutation<
  UpdateAttachmentMutation,
  UpdateAttachmentMutationVariables
>(
  () => gql`
    ${AttachmentDetailedInfoFragment()}

    mutation UpdateAttachment($id: uuid!, $input: attachment_set_input!) {
      update_attachment_by_pk(pk_columns: { id: $id }, _set: $input) {
        ...AttachmentDetailedInfo
      }
    }
  `
);

export const bindAttachmentsToMessage = (messageId: string, attachmentsIds: string[]) =>
  attachmentsIds.map(async (id) => {
    await updateAttachment({ id, input: { message_id: messageId } });
  });

export const [useRemoveAttachment, { mutate: removeAttachment }] = createMutation<
  RemoveAttachmentMutation,
  RemoveAttachmentMutationVariables
>(
  () => gql`
    mutation RemoveAttachment($id: uuid!) {
      delete_attachment_by_pk(id: $id) {
        id
        message_id
      }
    }
  `,
  {
    optimisticResponse(variables) {
      const attachment = AttachmentDetailedInfoFragment.assertRead(variables.id);

      assert(attachment.message, "No attachment message");

      return {
        __typename: "mutation_root",
        delete_attachment_by_pk: {
          __typename: "attachment",
          id: variables.id,
          message_id: attachment.message.id,
        },
      };
    },
    onOptimisticOrActualResponse({ message_id }, variables) {
      if (!message_id) return;

      MessageDetailedInfoFragment.update(message_id, (message) => {
        message.message_attachments = message.message_attachments.filter((messageAttachment) => {
          return messageAttachment.id !== variables.id;
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
