import axios from "axios";
import { uploadUrlQueryManager } from "~frontend/gql/attachments";

interface UploadFileConfig {
  onUploadProgress?: (percentage: number) => void;
}

export async function uploadFile(file: File, config: UploadFileConfig = {}): Promise<EditorAttachmentInfo> {
  const { name: fileName, type: mimeType } = file;
  const { uploadUrlInfo } = await uploadUrlQueryManager.fetch({ fileName, mimeType }, { fetchPolicy: "no-cache" });

  if (!uploadUrlInfo) {
    throw new Error("unable to upload file");
  }

  await axios({
    method: "PUT",
    url: decodeURIComponent(uploadUrlInfo.uploadUrl),
    headers: {
      "Content-Type": mimeType,
    },
    data: file,
    onUploadProgress: (e) => {
      const progressPercentage = Math.round((e.loaded * 100) / e.total);

      config.onUploadProgress?.(progressPercentage);
    },
  });

  return {
    uuid: uploadUrlInfo.uuid,
    mimeType: mimeType,
  };
}

export interface EditorAttachmentInfo {
  uuid: string;
  mimeType: string;
}

export async function uploadFiles(files: File[]): Promise<EditorAttachmentInfo[]> {
  const uploadedAttachments = await Promise.all(
    files.map(async (file): Promise<EditorAttachmentInfo> => {
      return await uploadFile(file);
    })
  );

  return uploadedAttachments;
}
