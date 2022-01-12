import { ActionHandler } from "@aca/backend/src/actions/actionHandlers";
import { db } from "@aca/db";

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
        user_id: _userId,
      },
    });

    const uploadUrl = await getSignedUploadUrl(uuid, mimeType);

    return { uploadUrl, uuid };
  },
};
