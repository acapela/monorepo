import {
  Attachment,
  Message,
  Notification,
  Room,
  RoomInvitation,
  RoomMember,
  Space,
  Team,
  TeamInvitation,
  TeamMember,
  Topic,
  User,
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
