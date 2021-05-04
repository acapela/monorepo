import axios from "axios";
import React from "react";
import { getUploadUrlQueryManager, useGetAttachmentQuery } from "~frontend/gql/threads";
import { MessageAttachment } from "~frontend/views/thread/Message/MessageAttachment";

interface UploadFileConfig {
  onUploadProgress?: (percentage: number) => void;
}

export async function uploadFile(file: File, config: UploadFileConfig = {}) {
  const { name: fileName, type: mimeType } = file;
  const { get_upload_url } = await getUploadUrlQueryManager.fetch({ fileName, mimeType });

  if (!get_upload_url) {
    throw new Error("unable to upload file");
  }

  await axios({
    method: "PUT",
    url: decodeURIComponent(get_upload_url.uploadUrl),
    headers: {
      "Content-Type": mimeType,
    },
    data: file,
    onUploadProgress: (e) => {
      const progressPercentage = Math.round((e.loaded * 100) / e.total);

      config.onUploadProgress?.(progressPercentage);
    },
  });

  return get_upload_url.uuid;
}
