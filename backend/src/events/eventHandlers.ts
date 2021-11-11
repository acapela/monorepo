import {
  Attachment,
  Message,
  MessageReaction,
  MessageTaskDueDate,
  Task,
  Team,
  TeamMember,
  Topic,
  TopicMember,
  Transcription,
  User,
} from "~db";

import { createHasuraEventsHandler } from "../hasura";

export const hasuraEvents = createHasuraEventsHandler<{
  message_updates: Message;
  task_updates: Task;
  message_task_due_date_updates: MessageTaskDueDate;
  message_reaction_updates: MessageReaction;
  team_updates: Team;
  topic_updates: Topic;
  topic_member_updates: TopicMember;
  attachment_updates: Attachment;
  transcription_updates: Transcription;
  team_member_updates: TeamMember;
  user_updates: User;
}>();
