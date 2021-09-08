import { MentionType } from "./mention";

export type TaskType = Exclude<MentionType, "notification-only">;
