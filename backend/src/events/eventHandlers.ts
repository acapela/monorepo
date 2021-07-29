import {
  Message,
  Room,
  RoomParticipants,
  Space,
  Team,
  TeamInvitation,
  Topic,
  User,
  Attachment,
  TeamMember,
  Notification,
} from "~db";
import { createHasuraEventsHandler } from "../hasura/events";

export const hasuraEvents = createHasuraEventsHandler<{
  message_updates: Message;
  room_updates: Room;
  space_updates: Space;
  team_invitation_updates: TeamInvitation;
  team_updates: Team;
  topic_updates: Topic;
  user_updates: User;
  room_member_updates: RoomParticipants;
  attachment_updates: Attachment;
  team_member_updates: TeamMember;
  notification_updates: Notification;
}>();
