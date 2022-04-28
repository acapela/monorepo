/* eslint-disable @typescript-eslint/no-explicit-any */

export const EventTypes = [
  "taskCreated",
  "taskPriorityUpdated",
  "taskStatusUpdated",
  "taskAssigneeUpdated",
  "taskDueDateUpdated",
  "taskCommentPosted",
] as const;
export type EventType = typeof EventTypes[number];

export interface Webhook {
  event: EventType;
  history_items: HistoryItem[];
  task_id: string;
  webhook_id: string;
}

export interface HistoryItem {
  id: string;
  type: number;
  date: string;
  field: string;
  parent_id: string;
  data: any;
  source: any;
  user: User;
  before: any;
  after: any;
  comment: any;
}

export interface User {
  id: number;
  username: string;
  email: string;
  color: string;
  initials: string;
  profilePicture?: string;
}
