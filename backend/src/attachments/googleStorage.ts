import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

const bucketName = process.env.GOOGLE_STORAGE_BUCKET;
const directory = "attachments";

/* We can have topic subdirectories if needed */
function getFilePath(fileId: string) {
  return `${directory}/${fileId}`;
}

export async function getSignedUploadUrl(uuid: string, mimeType: string): Promise<string> {
  const filePath = getFilePath(uuid);
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

export async function getSignedDownloadUrl(uuid: string): Promise<string> {
  const filePath = getFilePath(uuid);
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
