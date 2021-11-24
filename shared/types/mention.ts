export const REQUEST_READ = "request-read";

export const REQUEST_RESPONSE = "request-response";

export const REQUEST_ACTION = "request-action";

export const REQUEST_TYPES = [REQUEST_READ, REQUEST_RESPONSE, REQUEST_ACTION] as const;

export type RequestType = typeof REQUEST_TYPES[number];

export const MENTION_OBSERVER = "observer";

export const MENTION_TYPES = [...REQUEST_TYPES, MENTION_OBSERVER] as const;

export type MentionType = typeof MENTION_TYPES[number];

export const MENTION_TYPE_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Response",
  [REQUEST_READ]: "Read Confirmation",
  [REQUEST_ACTION]: "Action",
  [MENTION_OBSERVER]: "Observer",
};

export const MENTION_TYPE_PICKER_LABELS: Record<MentionType, string> = {
  [REQUEST_RESPONSE]: "Request response",
  [REQUEST_READ]: "Request read confirmation",
  [REQUEST_ACTION]: "Request action",
  [MENTION_OBSERVER]: "Add as observer",
};

export function getMentionTypeLabel(type: MentionType) {
  return MENTION_TYPE_PICKER_LABELS[type];
}

export function getUncompletedTaskLabel(taskType: RequestType) {
  if (taskType === REQUEST_READ) {
    return "Mark as read";
  }
  if (taskType === REQUEST_ACTION) {
    return "Mark as done";
  }
  if (taskType === REQUEST_RESPONSE) {
    return "Mark as replied";
  }
}

export function getCompletedTaskLabel(taskType: RequestType) {
  if (taskType === REQUEST_READ) {
    return "Marked as read";
  }
  if (taskType === REQUEST_ACTION) {
    return "Marked as done";
  }
  if (taskType === REQUEST_RESPONSE) {
    return "Marked as replied";
  }
}
