import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import mime from "mime-types";

import { assertDefined } from "@aca/shared/assert";

const bucketName = assertDefined(process.env.GOOGLE_STORAGE_BUCKET, "GOOGLE_STORAGE_BUCKET env variable is required");

const directory = "attachments";

/* We can have topic subdirectories if needed */
function getFilePath(fileId: string, mimeType: string) {
  /* Having extension is critical for Sonix to get the file type right */
  return `${directory}/${fileId}.${mime.extension(mimeType)}`;
}

export async function getSignedUploadUrl(uuid: string, mimeType: string): Promise<string> {
  const filePath = getFilePath(uuid, mimeType);
  const expiresInMinutes = 0.5; // 30 seconds should be enough

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 60 * 1000 * expiresInMinutes,
    contentType: mimeType,
    virtualHostedStyle: true,
  };

  const storage = new Storage();
  const [uploadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

  return uploadUrl;
}

export async function getSignedDownloadUrl(uuid: string, mimeType: string): Promise<string> {
  const filePath = getFilePath(uuid, mimeType);
  const expiresInMinutes = 60;

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + 60 * 1000 * expiresInMinutes,
    virtualHostedStyle: true,
  };

  const storage = new Storage();
  const [downloadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

  return downloadUrl;
}
