import { MentionType } from "./mention";

export interface EditorMentionData<T = MentionType> {
  userId: string;
  type: T;
}

export interface EditorRequestLinkData {
  requestId: string;
}
