import {
  Attachment,
  Message,
  MessageReaction,
  Task,
  Team,
  TeamInvitation,
  TeamMember,
  Topic,
  Transcription,
} from "~db";

import { createHasuraEventsHandler } from "../hasura";

export const hasuraEvents = createHasuraEventsHandler<{
  message_updates: Message;
  task_updates: Task;
  message_reaction_updates: MessageReaction;
  team_invitation_updates: TeamInvitation;
  team_updates: Team;
  topic_updates: Topic;
  attachment_updates: Attachment;
  transcription_updates: Transcription;
  team_member_updates: TeamMember;
}>();
