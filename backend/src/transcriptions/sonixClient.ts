import querystring from "querystring";

import axios, { Method } from "axios";

import { assert, assertDefined } from "~shared/assert";
import { IS_DEV } from "~shared/dev";
import { SonixTranscriptData } from "~shared/types/transcript";

import { getDevPublicTunnelURL } from "../localtunnel";
import { SonixCustomData } from "./customData";

interface SonixRequestOptions<Input = Record<string, string>> {
  method: Method;
  path: string;
  formData?: Input;
}

export interface SonixMediaResponse {
  id: string;
  name: string;
  status: "preparing" | "transcribing" | "completed" | "blocked" | "failed";
  language: string;
  created_at: number;
  public_url: string;
  custom_data: SonixCustomData;
}

const sonixCallbackSecret = assertDefined(process.env.SONIX_CALLBACK_SECRET, "SONIX_CALLBACK_SECRET is required");

const SONIX_API_URL = "https://api.sonix.ai/v1";

/**
 * Sonix will take some time to prepare the transcript and it'll let us know when it is ready.
 *
 * Thus, to let us know it has to know some url to call.
 *
 * In production it is normal, public url of the backend, but when testing locally we need some way of 'outer' world
 * to let us know.
 *
 * Because of that, we're using tunnel that will create 'proxy' connecting to localhost and get us public url.
 */
async function getPublicBackendUrl() {
  if (IS_DEV) {
    return `${await getDevPublicTunnelURL()}/api`;
  }

  return process.env.BACKEND_API_ENDPOINT;
}

export async function getSonixCallbackUrl() {
  const backendUrl = await getPublicBackendUrl();
  const endpoint = "/v1/transcriptions";

  assert(backendUrl, "Failed to build callback URL");

  return `${backendUrl}${endpoint}?secret=${encodeURIComponent(sonixCallbackSecret)}`;
}

async function sendSonixRequest<Output>({ method, path, formData }: SonixRequestOptions) {
  const { data } = await axios({
    method,
    url: `${SONIX_API_URL}${path}`,
    headers: {
      Authorization: `Bearer ${process.env.SONIX_API_KEY}`,
    },
    data: querystring.encode(formData),
  });

  return data as Output;
}

export async function requestSonixMediaTranscript({
  attachmentId,
  fileUrl,
  fileName,
  language,
}: {
  attachmentId: string;
  fileUrl: string;
  fileName: string;
  language: string;
}): Promise<SonixMediaResponse> {
  const callbackUrl = await getSonixCallbackUrl();

  const formData = {
    file_url: fileUrl,
    name: fileName,
    language,
    callback_url: callbackUrl,
    custom_data: JSON.stringify({ attachmentId } as SonixCustomData),
  };

  return await sendSonixRequest<SonixMediaResponse>({
    method: "POST",
    path: "/media",
    formData,
  });
}

export async function fetchSonixTranscriptForMedia(mediaId: string): Promise<SonixTranscriptData> {
  return await sendSonixRequest<SonixTranscriptData>({
    method: "GET",
    path: `/media/${mediaId}/transcript.json`,
  });
}
