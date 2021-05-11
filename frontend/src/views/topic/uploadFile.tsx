import axios from "axios";
import { getUploadUrlQueryManager } from "~frontend/gql/topics";

interface UploadFileConfig {
  onUploadProgress?: (percentage: number) => void;
}

export async function uploadFile(file: File, config: UploadFileConfig = {}) {
  const { name: fileName, type: mimeType } = file;
  const { uploadUrlInfo } = await getUploadUrlQueryManager.fetch({ fileName, mimeType });

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
