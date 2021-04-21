import { Router } from "express";
import { v4 as uuid } from "uuid";
import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

import { db } from "~db";
import { ActionHandler } from "~backend/src/actions/actionHandlers";

export const router = Router();

const bucketName = `meetnomoreapp.appspot.com`;
const directory = "acapela/attachments/";

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
    const id = uuid();

    const storage = new Storage();

    const filePath = `${directory}${id}`;
    // TODO: make as small as possible
    const mins = 0.5; // 30 seconds should be enough

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 60 * 1000 * mins,
      contentType: mimeType,
      virtualHostedStyle: true,
    };

    const [uploadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

    await db.attachment.create({
      data: {
        id: id,
        original_name: fileName,
        mime_type: mimeType,
      },
    });

    return { uploadUrl, uuid: id };
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

    const filePath = `${directory}${uuid}`;
    const mins = 60;

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "read",
      expires: Date.now() + 60 * 1000 * mins,
      virtualHostedStyle: true,
    };

    const storage = new Storage();
    const [downloadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

    return {
      downloadUrl,
    };
  },
};
