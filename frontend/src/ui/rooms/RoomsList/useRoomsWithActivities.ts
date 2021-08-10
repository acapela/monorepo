import { useSSRRoomsMessagesCount } from "~frontend/utils/unreadMessages";
import { RoomDetailedInfoFragment } from "~gql";

export interface RoomWithActivities {
  room: RoomDetailedInfoFragment;
  unreadMessages: number;
}

export function useRoomsWithActivities(rooms: RoomDetailedInfoFragment[]): RoomWithActivities[] {
  const roomUnreadMessages = useSSRRoomsMessagesCount();

  return rooms.map((room: RoomDetailedInfoFragment) => ({
    room,
    unreadMessages: roomUnreadMessages[room.id] ?? 0,
  }));
}
