import { Message, Room, Space, Team, TeamInvitation, Topic } from "~db";
import { createHasuraEventsHandler } from "../hasura/events";

export const hasuraEvents =
  createHasuraEventsHandler<{
    message_updates: Message;
    room_updates: Room;
    space_updates: Space;
    team_invitation_updates: TeamInvitation;
    team_updates: Team;
    topic_updates: Topic;
  }>();
