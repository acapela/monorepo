export const REQUEST_READ = "request-read";

export const REQUEST_RESPONSE = "request-response";

export const REQUEST_ACTION = "request-action";

export const REQUEST_DECISION = "request-decision";

export const REQUEST_TYPES = [REQUEST_READ, REQUEST_RESPONSE, REQUEST_ACTION, REQUEST_DECISION] as const;

export type RequestType = typeof REQUEST_TYPES[number];

export const MENTION_OBSERVER = "observer";

export const MENTION_TYPES = [...REQUEST_TYPES, MENTION_OBSERVER] as const;

export type MentionType = typeof MENTION_TYPES[number];

export const MENTION_TYPE_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Response",
  [REQUEST_READ]: "Read Confirmation",
  [REQUEST_ACTION]: "Action",
  [REQUEST_DECISION]: "Decision",
  [MENTION_OBSERVER]: "Observer",
};

export const MENTION_TYPE_PICKER_LABELS: Record<MentionType, string> = {
  [REQUEST_ACTION]: "Request action",
  [REQUEST_RESPONSE]: "Request response",
  [REQUEST_READ]: "Request read confirmation",
  [REQUEST_DECISION]: "Request Decision",
  [MENTION_OBSERVER]: "Add as observer",
};

export const UNCOMPLETED_REQUEST_LABEL: Record<RequestType, string> = {
  [REQUEST_READ]: "Mark as read",
  [REQUEST_ACTION]: "Mark as done",
  [REQUEST_DECISION]: "Make Decision",
  [REQUEST_RESPONSE]: "Mark as replied",
};

export const COMPLETED_REQUEST_LABEL: Record<RequestType, string> = {
  [REQUEST_READ]: "Marked as read",
  [REQUEST_ACTION]: "Marked as done",
  [REQUEST_DECISION]: "Decision done",
  [REQUEST_RESPONSE]: "Marked as replied",
};
