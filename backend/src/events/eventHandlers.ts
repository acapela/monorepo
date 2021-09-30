import {
  Attachment,
  Message,
  MessageReaction,
  Room,
  RoomInvitation,
  RoomMember,
  Space,
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
  room_updates: Room;
  space_updates: Space;
  team_invitation_updates: TeamInvitation;
  room_invitation_updates: RoomInvitation;
  team_updates: Team;
  topic_updates: Topic;
  room_member_updates: RoomMember;
  attachment_updates: Attachment;
  transcription_updates: Transcription;
  team_member_updates: TeamMember;
}>();
