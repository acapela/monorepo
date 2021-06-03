import axios, { Method } from "axios";
import querystring from "querystring";
import { assert } from "~shared/assert";
import { getTunnelPublicUrl } from "../localtunnel";
import { isDev } from "../utils";

interface SonixOptions {
  key?: string;
}

interface SonixRequestOptions {
  method: Method;
  path: string;
  formData?: { [key: string]: string };
}

export interface MediaResponse {
  id: string;
  name: string;
  status: "preparing" | "transcribing" | "completed" | "blocked" | "failed";
  language: string;
  created_at: number;
  public_url: string;
  custom_data: { messageId: string };
}

export interface JsonTranscriptResponse {
  name: string;
  transcript: {
    speaker: string;
    start_time: number;
    end_time: number;
    words: {
      text: string;
      start_time: number;
      end_time: number;
    }[];
  }[];
}

let sonixClient: Sonix;

class Sonix {
  private url = "https://api.sonix.ai/v1";
  private key: string;

  constructor({ key = process.env.SONIX_API_KEY }: SonixOptions = {}) {
    assert(key, "Sonix API key is required");

    this.key = key;
  }

  private async getCallbackUrl() {
    const domain = isDev() ? await getTunnelPublicUrl() : process.env.BACKEND_HOST;
    const endpoint = "/api/v1/transcriptions";

    assert(domain, "Failed to build callback URL");

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return `${domain}${endpoint}?secret=${encodeURIComponent(process.env.SONIX_CALLBACK_SECRET!)}`;
  }

  private async doRequest({ method, path, formData }: SonixRequestOptions) {
    const { data } = await axios({
      method,
      url: `${this.url}${path}`,
      headers: {
        Authorization: `Bearer ${this.key}`,
      },
      data: querystring.encode(formData),
    });

    return data;
  }

  public async submitNewMedia({
    messageId,
    fileUrl,
    fileName,
    language,
  }: {
    messageId: string;
    fileUrl: string;
    fileName: string;
    language: string;
  }): Promise<MediaResponse> {
    const callbackUrl = await this.getCallbackUrl();
    const formData = {
      file_url: fileUrl,
      name: fileName,
      language,
      callback_url: callbackUrl,
      custom_data: JSON.stringify({ messageId }),
    };

    return await this.doRequest({
      method: "POST",
      path: "/media",
      formData,
    });
  }

  public async getJsonTranscript({ mediaId }: { mediaId: string }): Promise<JsonTranscriptResponse> {
    return await this.doRequest({
      method: "GET",
      path: `/media/${mediaId}/transcript.json`,
    });
  }
}

export function getSonixClient() {
  if (!sonixClient) {
    sonixClient = new Sonix();
  }

  return sonixClient;
}
