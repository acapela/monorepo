import { useList } from "react-use";

import { uploadFile } from "~frontend/ui/message/composer/attachments";
import { addToast } from "~ui/toasts/data";

import { EditorAttachmentInfo } from "./attachments";

interface UseUploadAttachmentsParams {
  onUploadFinish: (attachment: EditorAttachmentInfo) => void;
}

export const useUploadAttachments = ({ onUploadFinish }: UseUploadAttachmentsParams) => {
  const [uploadingAttachments, uploadingAttachmentsList] = useList<File>([]);

  const uploadAttachments = async (files: File[]) => {
    await Promise.all(
      files.map(async (file) => {
        uploadingAttachmentsList.push(file);

        try {
          const newAttachment = await uploadFile(file);
          onUploadFinish(newAttachment);
        } catch (err) {
          addToast({ type: "error", title: "Unable to upload file" });
        }

        uploadingAttachmentsList.set(uploadingAttachments.filter((attachment) => attachment !== file));

        return;
      })
    );
  };

  return {
    uploadingAttachments,
    uploadAttachments,
  } as const;
};
