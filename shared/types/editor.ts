import { MentionType } from "../requests";

export interface EditorMentionData<T = MentionType> {
  userId: string;
  type: T;
}

export interface EditorRequestLinkData {
  requestId: string;
}
