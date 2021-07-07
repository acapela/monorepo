import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { db } from "~db";
import { getSignedDownloadUrl, getSignedUploadUrl } from "./googleStorage";

interface UploadUrlParams {
  messageId: string;
  fileName: string;
  mimeType: string;
}

interface UploadUrlResponse {
  uploadUrl: string;
  uuid: string;
}

export const getUploadUrl: ActionHandler<UploadUrlParams, UploadUrlResponse> = {
  actionName: "get_upload_url",

  async handle(_userId, { messageId, fileName, mimeType }) {
    const { id: uuid } = await db.attachment.create({
      data: {
        message_id: messageId,
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

export const getDownloadUrl: ActionHandler<DownloadUrlParams, DownloadUrlResponse> = {
  actionName: "get_download_url",

  async handle(_userId, { uuid }) {
    const attachment = await db.attachment.findUnique({
      where: {
        id: uuid,
      },
    });

    if (!attachment) {
      throw new Error("Not found");
    }

    const downloadUrl = await getSignedDownloadUrl(uuid, attachment.mime_type);

    return { downloadUrl };
  },
};
