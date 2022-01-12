import { ApolloClient, gql } from "@apollo/client";
import axios from "axios";

import { UploadUrlQuery, UploadUrlQueryVariables } from "@aca/gql";

interface UploadFileConfig {
  onUploadProgress?: (percentage: number) => void;
}

const fetchUploadURL = (client: ApolloClient<unknown>, variables: UploadUrlQueryVariables) =>
  client.query<UploadUrlQuery, UploadUrlQueryVariables>({
    query: gql`
      query UploadURL($fileName: String!, $mimeType: String!) {
        uploadUrlInfo: get_upload_url(fileName: $fileName, mimeType: $mimeType) {
          uploadUrl
          uuid
        }
      }
    `,
    variables,
    fetchPolicy: "no-cache",
  });

export async function uploadFile(
  client: ApolloClient<unknown>,
  file: File,
  config: UploadFileConfig = {}
): Promise<EditorAttachmentInfo> {
  const { name: fileName, type: mimeType } = file;

  const {
    data: { uploadUrlInfo },
  } = await fetchUploadURL(client, { fileName, mimeType });

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

  return {
    uuid: uploadUrlInfo.uuid,
    mimeType: mimeType,
  };
}

export interface EditorAttachmentInfo {
  uuid: string;
  mimeType: string;
}

export interface EditorUploadingAttachmentInfo {
  file: File;
  percentage: number;
}

export async function uploadFiles(client: ApolloClient<unknown>, files: File[]): Promise<EditorAttachmentInfo[]> {
  const uploadedAttachments = await Promise.all(
    files.map(async (file): Promise<EditorAttachmentInfo> => {
      return await uploadFile(client, file);
    })
  );

  return uploadedAttachments;
}
