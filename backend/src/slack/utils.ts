import { WebAPICallError } from "@slack/web-api";

export function isChannelNotFoundError(error: unknown) {
  const webError = error as unknown as WebAPICallError;
  return "data" in webError && webError.data.error == "channel_not_found";
}
