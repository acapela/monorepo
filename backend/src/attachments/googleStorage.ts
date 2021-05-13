import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";
import { ATTACHMENT_LINK_EXPIRATION_TIME } from "~config/attachments";

const bucketName = process.env.GOOGLE_STORAGE_BUCKET;
const directory = "attachments";

/* We can have topic subdirectories if needed */
function getFilePath(fileId: string) {
  return `${directory}/${fileId}`;
}

const UPLOAD_TIMEOUT_TIME = 30 * 1000; // 30s

export async function getSignedUploadUrl(uuid: string, mimeType: string): Promise<string> {
  const filePath = getFilePath(uuid);

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + UPLOAD_TIMEOUT_TIME,
    contentType: mimeType,
    virtualHostedStyle: true,
  };

  const storage = new Storage();
  const [uploadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

  return uploadUrl;
}

export async function getSignedDownloadUrl(uuid: string): Promise<string> {
  const filePath = getFilePath(uuid);

  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "read",
    expires: Date.now() + ATTACHMENT_LINK_EXPIRATION_TIME,
    virtualHostedStyle: true,
  };

  const storage = new Storage();
  const [downloadUrl] = await storage.bucket(bucketName).file(filePath).getSignedUrl(options);

  return downloadUrl;
}
