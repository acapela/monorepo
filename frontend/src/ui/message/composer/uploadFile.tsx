import axios from "axios";
import { uploadUrlQueryManager } from "~frontend/gql/attachments";

interface UploadFileConfig {
  onUploadProgress?: (percentage: number) => void;
}

export async function uploadFile(file: File, config: UploadFileConfig = {}) {
  const { name: fileName, type: mimeType } = file;
  const { uploadUrlInfo } = await uploadUrlQueryManager.fetch({ fileName, mimeType });

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

  return uploadUrlInfo.uuid;
}

export interface UploadedFileInfo {
  uuid: string;
  mimeType: string;
}

async function uploadFiles(files: File[]): Promise<UploadedFileInfo[]> {
  const uploadedAttachments = await Promise.all(
    files.map(async (file): Promise<UploadedFileInfo> => {
      const uuid = await uploadFile(file);

      return {
        uuid,
        mimeType: file.type,
      };
    })
  );

  return uploadedAttachments;
}
