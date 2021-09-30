import { WebAPICallError } from "@slack/web-api";

export const isWebAPIErrorType = (error: unknown, errorType: string) => {
  const webError = error as unknown as WebAPICallError;
  return "data" in webError && webError.data.error == errorType;
};

export const isChannelNotFoundError = (error: unknown) => isWebAPIErrorType(error, "channel_not_found");
