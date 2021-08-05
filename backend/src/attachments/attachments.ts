import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { db } from "~db";
import { getSignedUploadUrl } from "./googleStorage";

interface UploadUrlParams {
  fileName: string;
  mimeType: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  uuid: string;
}

export const getUploadUrl: ActionHandler<UploadUrlParams, UploadUrlResponse> = {
  actionName: "get_upload_url",

  async handle(_userId, { fileName, mimeType }) {
    const { id: uuid } = await db.attachment.create({
      data: {
        original_name: fileName,
        mime_type: mimeType,
      },
    });

    const uploadUrl = await getSignedUploadUrl(uuid, mimeType);

    return { uploadUrl, uuid };
  },
};

interface DownloadUrlParams {
  uuid: string;
}

interface DownloadUrlResponse {
  downloadUrl: string;
}

// this should be removed
export const getDownloadUrl: ActionHandler<DownloadUrlParams, DownloadUrlResponse> = {
  actionName: "get_download_url",

  async handle(_userId, { uuid }) {
    return {
      downloadUrl: `/attachments/${uuid}`,
    };
  },
};
