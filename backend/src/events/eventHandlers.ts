import {
  Message,
  Room,
  RoomMember,
  Space,
  Team,
  TeamInvitation,
  RoomInvitation,
  Topic,
  User,
  Attachment,
  TeamMember,
  Notification,
} from "~db";
import { createHasuraEventsHandler } from "../hasura";

export const hasuraEvents = createHasuraEventsHandler<{
  message_updates: Message;
  room_updates: Room;
  space_updates: Space;
  team_invitation_updates: TeamInvitation;
  room_invitation_updates: RoomInvitation;
  team_updates: Team;
  topic_updates: Topic;
  user_updates: User;
  room_member_updates: RoomMember;
  attachment_updates: Attachment;
  team_member_updates: TeamMember;
  notification_updates: Notification;
}>();
