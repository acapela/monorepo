import { useApolloClient } from "@apollo/client";
import { useList } from "react-use";

import { EditorUploadingAttachmentInfo, uploadFile } from "@aca/frontend/message/composer/attachments";
import { addToast } from "@aca/ui/toasts/data";

import { EditorAttachmentInfo } from "./attachments";

interface UseUploadAttachmentsParams {
  onUploadFinish: (attachment: EditorAttachmentInfo) => void;
}

export const useUploadAttachments = ({ onUploadFinish }: UseUploadAttachmentsParams) => {
  const apolloClient = useApolloClient();
  const [uploadingAttachments, uploadingAttachmentsList] = useList<EditorUploadingAttachmentInfo>([]);

  const uploadAttachments = async (files: File[]) => {
    await Promise.all(
      files.map(async (file) => {
        uploadingAttachmentsList.push({
          file,
          percentage: 0,
        });

        try {
          const newAttachment = await uploadFile(apolloClient, file, {
            onUploadProgress: (percentage) => {
              uploadingAttachmentsList.update((attachment) => attachment.file === file, {
                file,
                percentage,
              });
            },
          });

          onUploadFinish(newAttachment);
        } catch (err) {
          addToast({ type: "error", title: "Unable to upload file" });
        }

        uploadingAttachmentsList.filter((attachment) => attachment.file !== file);

        // uploadingAttachmentsList.set(uploadingAttachments.filter((attachment) => attachment !== file));

        return;
      })
    );
  };

  return {
    uploadingAttachments,
    uploadAttachments,
  } as const;
};
