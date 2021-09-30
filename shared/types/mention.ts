export const REQUEST_READ = "request-read";

export const REQUEST_RESPONSE = "request-response";

export type MentionType = typeof REQUEST_READ | typeof REQUEST_RESPONSE;

export const DEFAULT_MENTION_TYPE: MentionType = REQUEST_READ;
