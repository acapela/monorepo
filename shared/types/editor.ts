import { MentionType } from "./mention";

export interface EditorMentionData {
  userId: string;
  originalName: string;
  type: MentionType;
}
