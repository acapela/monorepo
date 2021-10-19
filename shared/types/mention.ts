export const REQUEST_READ = "request-read";

export const REQUEST_RESPONSE = "request-response";

export const REQUEST_ACTION = "request-action";

export const MENTION_OBSERVER = "observer";

export type RequestType = typeof REQUEST_READ | typeof REQUEST_RESPONSE | typeof REQUEST_ACTION;

export type MentionType = RequestType | typeof MENTION_OBSERVER;

export const MENTION_TYPE_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Feedback",
  [REQUEST_READ]: "Read Confirmation",
  [REQUEST_ACTION]: "Action",
  [MENTION_OBSERVER]: "Observer",
};

export const NEW_MENTION_TYPE_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Request response",
  [REQUEST_READ]: "Request read confirmation",
  [REQUEST_ACTION]: "Request action",
  [MENTION_OBSERVER]: "Add as observer",
};
