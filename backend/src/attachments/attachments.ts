import { ActionHandler } from "~backend/src/actions/actionHandlers";
import { db } from "~db";
import { getSignedDownloadUrl, getSignedUploadUrl } from "./googleStorage";

interface GetUploadUrlParams {
  fileName: string;
  mimeType: string;
}

interface GetUploadUrlResponse {
  uploadUrl: string;
  uuid: string;
}

export const getUploadUrl: ActionHandler<GetUploadUrlParams, GetUploadUrlResponse> = {
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

interface GetDownloadUrlParams {
  uuid: string;
}

interface GetDownloadUrlResponse {
  downloadUrl: string;
}

export const getDownloadUrl: ActionHandler<GetDownloadUrlParams, GetDownloadUrlResponse> = {
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

    const downloadUrl = await getSignedDownloadUrl(uuid);

    return { downloadUrl };
  },
};
